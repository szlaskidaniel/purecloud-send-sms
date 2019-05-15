# Send SMS
This extension allow to be embedded into PureCloud interface and via SendSMS button send to the active caller SMS message directly from PureCloud.

## Installation steps
To make it work, first valid inbound Script is needed. After that add new WebForm component and set it's url to the one below:

`https://localhost/index.html?conversationId={{Scripter.Interaction ID}}&queueId={{Scripter.Queue ID}}&phoneNumber={{Scripter.Customer Formatted Number}}`

It's good that width of the image takes 100% of the window (notification messages) and heigh should be at least 200px.
