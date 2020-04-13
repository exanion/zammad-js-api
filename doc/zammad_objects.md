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