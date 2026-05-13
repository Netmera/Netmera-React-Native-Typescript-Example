///
/// Copyright (c) 2026 Netmera Research.
///

import Foundation

enum NetmeraSettingsKeys {
    static let environment = "environment"
    static let baseURL = "baseURL"
    static let APIKey = "APIKey"
}

enum NetmeraEnvironment: String {
    case test
    case preprod
    case prod
    case custom

    var url: String {
        switch self {
        case .test: return "https://sdk-cloud-test.sdpaas.com"
        case .preprod: return "https://sdk-cloud-uat.sdpaas.com"
        case .prod: return "https://sdkapi.netmera.com"
        case .custom: return ""
        }
    }

    var defaultApiKey: String {
        switch self {
        case .test: return "gFtyH_nz5WDqpkkpQX-3Qn4e8xbxuQroQ1BwUItYPzdGiPjlHM-_eKeoG4wr2GHFvp0KoCf-8ts"
        case .preprod: return "gFtyH_nz5WDqpkkpQX-3Qn4e8xbxuQronOkkqhUjXw50my32OqV7lQlSPYMqNhYWGXQxPbXLLKQ"
        case .prod: return "gFtyH_nz5WAWBrHDHVZGclG4W_qB0XRba1aqIfXpmXLuZtIs4D_CU0iIL-uUs-aw"
        case .custom: return ""
        }
    }
}
