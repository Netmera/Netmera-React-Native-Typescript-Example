//
//  NotificationService.swift
//  Netmera_NotificationServiceExtension
//
//  Created by Initial Code on 27.02.2024.
//

import UserNotifications
import NetmeraNotificationServiceExtension

class NotificationService : NetmeraNotificationServiceExtension {

    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (_ contentToDeliver: UNNotificationContent) -> Void) {
        super.didReceive(request, withContentHandler: contentHandler)
    }

    override func serviceExtensionTimeWillExpire() {
        super.serviceExtensionTimeWillExpire()
    }

}
