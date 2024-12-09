function sendEmailByAPI(to, subject, body) {
	try {
		let obj = Gmail.newMessage();
		let message = "From: me\r\n" +
			`To: ${to}\r\n` +
			`Subject: ${subject}\r\n\r\n` +
			`${body}`;
		obj.raw = Utilities.base64EncodeWebSafe(message, Utilities.Charset.UTF_8); // 日本語
		let response = Gmail.Users.Messages.send(obj, "me");
		Utilities.sleep(5000); // バウンス待ちで5秒待機
		let thread = Gmail.Users.Threads.get("me", response.id);
		for (let i = 0; i < thread.messages.length; i++) {
			if (thread.messages[i].payload.headers.some(header => header.value.includes("mailer-daemon@googlemail.com"))) {
			return {"OK": false, "message": "Send failure"};
			}
		}
		return {"OK": true, "message": "Send success"};
	} catch (error) {
		Logger.log(error);
		return {"OK": false, "message": error};
	}
}

function test() {
	let body = "GASのテストだよ〜"
	let response = sendEmailByAPI("yourmail@example.com", "testMail", body);
	Logger.log(response.message);
}
