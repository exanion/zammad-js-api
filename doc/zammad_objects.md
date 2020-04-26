# Zammad objects as returned by API (samples)

## User object

```
{
  "id": 3,
  "organization_id": null,
  "login": "peter.kappelt@exanion.de",
  "firstname": "Peter",
  "lastname": "Kappelt",
  "email": "peter.kappelt@exanion.de",
  "image": null,
  "image_source": null,
  "web": "",
  "phone": "",
  "fax": "",
  "mobile": "",
  "department": "",
  "street": "",
  "zip": "",
  "city": "",
  "country": "",
  "address": "",
  "vip": false,
  "verified": false,
  "active": true,
  "note": "",
  "last_login": "2020-04-13T05:36:33.216Z",
  "source": null,
  "login_failed": 0,
  "out_of_office": false,
  "out_of_office_start_at": null,
  "out_of_office_end_at": null,
  "out_of_office_replacement_id": null,
  "preferences": {
    "notification_config": {
      "matrix": {
        "create": {
          "criteria": {
            "owned_by_me": true,
            "owned_by_nobody": true,
            "no": false
          },
          "channel": {
            "email": true,
            "online": true
          }
        },
        "update": {
          "criteria": {
            "owned_by_me": true,
            "owned_by_nobody": true,
            "no": false
          },
          "channel": {
            "email": true,
            "online": true
          }
        },
        "reminder_reached": {
          "criteria": {
            "owned_by_me": true,
            "owned_by_nobody": false,
            "no": false
          },
          "channel": {
            "email": true,
            "online": true
          }
        },
        "escalation": {
          "criteria": {
            "owned_by_me": true,
            "owned_by_nobody": false,
            "no": false
          },
          "channel": {
            "email": true,
            "online": true
          }
        }
      }
    },
    "locale": "de-de",
    "intro": true
  },
  "updated_by_id": 3,
  "created_by_id": 1,
  "created_at": "2020-04-12T03:38:16.023Z",
  "updated_at": "2020-04-13T05:36:33.221Z",
  "role_ids": [
    1,
    2
  ],
  "organization_ids": [],
  "authorization_ids": [],
  "group_ids": {
    "1": [
      "full"
    ]
  }
}
```

## Ticket object
```
{
    "id": 2,
    "group_id": 1,
    "priority_id": 2,
    "state_id": 1,
    "organization_id": null,
    "number": "27002",
    "title": "test1",
    "owner_id": 3,
    "customer_id": 4,
    "note": null,
    "first_response_at": null,
    "first_response_escalation_at": null,
    "first_response_in_min": null,
    "first_response_diff_in_min": null,
    "close_at": null,
    "close_escalation_at": null,
    "close_in_min": null,
    "close_diff_in_min": null,
    "update_escalation_at": null,
    "update_in_min": null,
    "update_diff_in_min": null,
    "last_contact_at": "2020-04-26T08:29:38.941Z",
    "last_contact_agent_at": null,
    "last_contact_customer_at": "2020-04-26T08:29:38.941Z",
    "last_owner_update_at": "2020-04-26T08:40:42.212Z",
    "create_article_type_id": 1,
    "create_article_sender_id": 2,
    "article_count": 1,
    "escalation_at": null,
    "pending_time": null,
    "type": null,
    "time_unit": null,
    "preferences": {
        "channel_id": 3
    },
    "updated_by_id": 3,
    "created_by_id": 4,
    "created_at": "2020-04-26T08:29:38.915Z",
    "updated_at": "2020-04-26T08:40:42.201Z"
}
```

## Ticket State
```
{
    "id": 1,
    "state_type_id": 1,
    "name": "new",
    "next_state_id": null,
    "ignore_escalation": false,
    "default_create": true,
    "default_follow_up": false,
    "note": null,
    "active": true,
    "updated_by_id": 1,
    "created_by_id": 1,
    "created_at": "2020-04-26T08:20:31.876Z",
    "updated_at": "2020-04-26T08:20:31.895Z"
}
```

## Ticket Priority
```
{
    "id": 1,
    "name": "1 low",
    "default_create": false,
    "ui_icon": "low-priority",
    "ui_color": "low-priority",
    "note": null,
    "active": true,
    "updated_by_id": 1,
    "created_by_id": 1,
    "created_at": "2020-04-26T08:20:31.942Z",
    "updated_at": "2020-04-26T08:20:31.959Z"
}
```

## Ticket Article
```
{
    "id": 1,
    "ticket_id": 1,
    "type_id": 5,
    "sender_id": 2,
    "from": "Nicole Braun <nicole.braun@zammad.org>",
    "to": null,
    "cc": null,
    "subject": null,
    "reply_to": null,
    "message_id": null,
    "message_id_md5": null,
    "in_reply_to": null,
    "content_type": "text/plain",
    "references": null,
    "body": "Welcome!\n\n  Thank you for choosing Zammad.\n\n  You will find updates and patches at https://zammad.org/. Online\n  documentation is available at https://zammad.org/documentation. Get\n  involved (discussions, contributing, ...) at https://zammad.org/participate.\n\n  Regards,\n\n  Your Zammad Team\n  ",
    "internal": false,
    "preferences": {},
    "updated_by_id": 2,
    "created_by_id": 2,
    "origin_by_id": 2,
    "created_at": "2020-04-26T08:20:32.327Z",
    "updated_at": "2020-04-26T08:20:32.327Z",
    "attachments": [],
    "type": "phone",
    "sender": "Customer",
    "created_by": "nicole.braun@zammad.org",
    "updated_by": "nicole.braun@zammad.org",
    "origin_by": "nicole.braun@zammad.org"
}
```