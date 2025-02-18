//
//  MyActivityAttributes.swift
//  NetmeraTSExample
//
//  Created by Baki Güneş on 17.02.2025.
//

import ActivityKit

struct MyActivityAttributes: ActivityAttributes {
    struct ContentState: Codable, Hashable {
        var emoji: String
    }
    var name: String
}
