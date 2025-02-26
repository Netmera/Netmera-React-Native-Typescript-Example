//
//  MatchLiveScoreWidgetExtensionLiveActivity.swift
//  MatchLiveScoreWidgetExtension
//
//

import ActivityKit
import WidgetKit
import SwiftUI

struct MatchLiveScoreWidgetExtensionLiveActivity: Widget {
    var body: some WidgetConfiguration {
      ActivityConfiguration(for: MatchLiveScoreWidgetExtensionAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension MatchLiveScoreWidgetExtensionAttributes {
    fileprivate static var preview: MatchLiveScoreWidgetExtensionAttributes {
        MatchLiveScoreWidgetExtensionAttributes(name: "World")
    }
}

extension MatchLiveScoreWidgetExtensionAttributes.ContentState {
    fileprivate static var smiley: MatchLiveScoreWidgetExtensionAttributes.ContentState {
        MatchLiveScoreWidgetExtensionAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: MatchLiveScoreWidgetExtensionAttributes.ContentState {
         MatchLiveScoreWidgetExtensionAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: MatchLiveScoreWidgetExtensionAttributes.preview) {
   MatchLiveScoreWidgetExtensionLiveActivity()
} contentStates: {
    MatchLiveScoreWidgetExtensionAttributes.ContentState.smiley
    MatchLiveScoreWidgetExtensionAttributes.ContentState.starEyes
}
