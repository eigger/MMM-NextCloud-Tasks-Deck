# MMM-NextCloud-Tasks-Deck

## Dependencies

- Working NextCloud installation
- Installed Tasks app


## Installing the module

1. Navigate to your local `MagicMirror/modules` directory
2. run `git clone https://github.com/eigger/MMM-NextCloud-Tasks-Deck.git`
2. run `npm install`

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
    modules: [
        {
            module: 'MMM-NextCloud-Tasks-Deck',
            config: {
                // See 'Configuration options' for more information.
                updateInterval: 60000,
                listUrl: "<NEXTCLOUD_TASKS_PRIVATE_LINK>",
                webDavAuth: {
                    username: "<NEXTCLOUD_APP_USERNAME>",
                    password: "<NEXTCLOUD_APP_PASSWORD>",
                }
            }
        }
    ]
}
```

## Configuration options

| Option               | Description
|----------------------|-----------
| `listUrl`            | *Required*: "Private Link" url from your desired NextCloud task-list
| `webDavAuth`         | *Required*: WebDav Authentication object consisting of username and password. <br> Example: `{username: "<NEXTCLOUD_APP_USERNAME>", password: "<NEXTCLOUD_APP_PASSWORD>",}`
| `updateInterval`     | *Optional*: How often should the data be refreshed (in milliseconds)



