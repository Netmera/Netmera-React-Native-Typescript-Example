//
//  MatchLiveScoreWidgetExtensionBundle.swift
//  MatchLiveScoreWidgetExtension
//
//

import WidgetKit
import SwiftUI

@main
struct MatchLiveScoreWidgetExtensionBundle: WidgetBundle {
    var body: some Widget {
        MatchLiveScoreWidgetExtension()
        MatchLiveScoreWidgetExtensionControl()
        MatchLiveScoreWidgetExtensionLiveActivity()
    }
}
