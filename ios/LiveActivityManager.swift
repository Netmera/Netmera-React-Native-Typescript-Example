//
//  File.swift
//  NetmeraTSExample
//
//  Copyright © 2024 netmera. All rights reserved.
//

import Foundation
import ActivityKit
import os.log
import UIKit
import Netmera
import CoreTelephony

/// Typealias for Activity Attributes used in this file
typealias ActivityType = MatchLiveScoreWidgetExtensionAttributes

/// Represents the state of a Live Activity
@available(iOS 16.2, *)
struct ActivityViewState: Sendable, Hashable {

  /// Equatable implementation for comparing two ActivityViewState instances
  static func == (lhs: ActivityViewState, rhs: ActivityViewState) -> Bool {
    lhs.id == rhs.id &&
    lhs.pushToken == rhs.pushToken &&
    lhs.contentState == rhs.contentState &&
    lhs.attributes.name == rhs.attributes.name &&
    lhs.activityState == rhs.activityState
  }

  /// Hashable implementation for using this struct in collections like dictionaries
  func hash(into hasher: inout Hasher) {
    hasher.combine(id)
  }

  let id: String
  var activityState: ActivityState
  var contentState: ActivityType.ContentState
  var attributes: ActivityType
  var pushToken: String? = nil

  /// Determines if the end controls should be displayed based on the activity state
  var shouldShowEndControls: Bool {
    switch activityState {
    case .active, .stale:
      return true
    case .ended, .dismissed:
      return false
    @unknown default:
      return false
    }
  }

  /// Flag to disable update controls (defaults to false)
  var updateControlDisabled: Bool = false

  /// Determines if the update controls should be displayed based on the activity state
  var shouldShowUpdateControls: Bool {
    switch activityState {
    case .active, .stale:
      return true
    case .ended, .dismissed:
      return false
    @unknown default:
      return false
    }
  }

  /// Indicates whether the activity is in a stale state
  var isStale: Bool {
    return activityState == .stale
  }
}

/// Manager class for handling Live Activities
@available(iOS 17.2, *)
@objc public class LiveActivityManager: NSObject, ObservableObject {

  /// Shared singleton instance
  @objc public static let shared: LiveActivityManager = LiveActivityManager()

  /// Push-to-start token for initiating activities
  @Published var pushToStartToken: String = ""

  /// Dictionary of all current activity states indexed by their ID
  @Published var activityViewStateItems: [String: ActivityViewState] = [:]

  /// Initializer that fetches all existing activities
  @objc override init() {
    super.init()
    fetchAllActivities()
  }

  /// Fetches all existing Live Activities and initializes their states
  @objc func fetchAllActivities() {
    activityViewStateItems.removeAll()
    Activity<ActivityType>.activities.forEach { activity in
      updateActivityViewState(for: activity)
      observeUpdates(for: activity)
    }
  }

  /// Starts observing push-to-start token updates
  @objc func getPushToStartToken() {
    observePushToStartTokenUpdates()
    observeActivityUpdates()
  }

  /// Updates the ActivityViewState for a given activity
  private func updateActivityViewState(for activity: Activity<ActivityType>) {
    let pushTokenString = activity.pushToken?.map { String(format: "%02x", $0) }.joined()
    activityViewStateItems[activity.id] = ActivityViewState(
      id: activity.id,
      activityState: activity.activityState,
      contentState: activity.content.state,
      attributes: activity.attributes,
      pushToken: pushTokenString
    )
  }

  /// Observes updates (state, token, content) for a specific activity
  private func observeUpdates(for activity: Activity<ActivityType>) {
    Task {
      await withTaskGroup(of: Void.self) { group in
        // Observing state updates
        group.addTask {
          for await state in activity.activityStateUpdates {
            self.handleActivityStateChange(activity, state: state)
          }
        }

        // Observing push token updates
        group.addTask {
          for await token in activity.pushTokenUpdates {
            self.handlePushTokenUpdate(activity, token: token)
          }
        }

        // Observing content updates
        group.addTask {
          for await content in activity.contentUpdates {
            self.updateActivityState(id: activity.id) { $0.contentState = content.state }
          }
        }
      }
    }
  }

  /// Observes push-to-start token updates from the system
  private func observePushToStartTokenUpdates() {
    Task {
      for await data in Activity<ActivityType>.pushToStartTokenUpdates {
        handlePushToStartToken(data)
      }
    }
  }

  /// Observes overall activity updates for all activities
  private func observeActivityUpdates() {
    Task {
      for await activity in Activity<ActivityType>.activityUpdates {
        handleActivityUpdate(activity)
      }
    }
  }

  /// Handles updates to an activity's push token
  private func handlePushTokenUpdate(_ activity: Activity<ActivityType>, token: Data) {
    let tokenString = token.map { String(format: "%02x", $0) }.joined()
    updateActivityState(id: activity.id) { $0.pushToken = tokenString }
    sendUpdateTokenEvent(for: activity.id, token: tokenString)
  }

  /// Handles changes in an activity's state
  private func handleActivityStateChange(_ activity: Activity<ActivityType>, state: ActivityState) {
    switch state {
    case .active:
      break
    case .dismissed, .ended:
      Task { await endLiveActivity(activity) }
    case .stale:
      break
    @unknown default:
      break
    }
  }

  /// Processes push-to-start token updates
  private func handlePushToStartToken(_ data: Data) {
    let token = data.map { String(format: "%02x", $0) }.joined()
    pushToStartToken = token
    sendStartTokenEvent(token: token)
  }

  /// Handles updates to an activity's overall state
  private func handleActivityUpdate(_ activity: Activity<ActivityType>) {
    switch activity.activityState {
    case .active:
      observeUpdates(for: activity)
    case .dismissed, .ended:
      Task { await endLiveActivity(activity) }
    case .stale:
      break
    @unknown default:
      break
    }
    fetchAllActivities()
  }

  /// Sends an event to update the activity token
  private func sendUpdateTokenEvent(for groupId: String, token: String) {
    let event = NetmeraLiveActivityUpdateTokenEvent()
    event.token = token
    event.groupId = groupId
    Netmera.send(event)
  }

  /// Sends an event to notify about a push-to-start token
  private func sendStartTokenEvent(token: String) {
    let event = NetmeraLiveActivityStartTokenEvent()
    event.token = token
    Netmera.send(event)
  }

  /// Ends a live activity and cleans up its state
  private func endLiveActivity(_ activity: Activity<ActivityType>) async {
    let event = NetmeraLiveActivityCloseEvent()
    event.groupId = activity.id
    Netmera.send(event)
    activityViewStateItems.removeValue(forKey: activity.id)
  }

  /// Safely updates the state of an activity by applying a modification closure
  private func updateActivityState(id: String, modify: (inout ActivityViewState) -> Void) {
    guard var state = activityViewStateItems[id] else { return }
    modify(&state)
    activityViewStateItems[id] = state
  }
}
