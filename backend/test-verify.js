const http = require('http');

console.log('--- Starting Backend Connectivity Test ---');

function postLogin() {
    console.log('Attemping to login with admin/admin...');
    const data = JSON.stringify({ username: 'admin', password: 'admin' });
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log(`Login Status Code: ${res.statusCode}`);
            try {
                const json = JSON.parse(body);
                console.log('Login Response Structure:', JSON.stringify(json, null, 2));

                // Logic to find token based on TransformInterceptor structure
                // Expecting: { statusCode, message, data: { access_token } }
                let token = null;
                if (json.data && json.data.access_token) {
                    token = json.data.access_token;
                    console.log('-> Token found in json.data.access_token (Correct for standard response)');
                } else if (json.access_token) {
                    token = json.access_token;
                    console.log('-> Token found in json.access_token (Direct response)');
                }

                if (token) {
                    console.log(`\nToken acquired (first 20 chars): ${token.substring(0, 20)}...`);
                    console.log('Proceeding to test protected route /todo...');
                    getTodo(token);
                } else {
                    console.error('ERROR: Could not find access_token in response.');
                }
            } catch (e) {
                console.error('Failed to parse login response:', body);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with login request: ${e.message}`);
    });

    req.write(data);
    req.end();
}

function getTodo(token) {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/todo?page=1&limit=5',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    const req = http.request(options, (res) => {
        console.log(`\nTodo API Status Code: ${res.statusCode}`);
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log('Todo API Response:', body.substring(0, 200) + '...');
            if (res.statusCode === 200) {
                console.log('\n--- TEST RESULT: PASS ---');
                console.log('Backend is fully functional. Authentication works correctly.');
                console.log('Note: Please check if your Frontend handles the response structure (data.data.access_token) correctly.');
            } else {
                console.log('\n--- TEST RESULT: FAIL ---');
                console.log('Backend returned error for protected route.');
            }
        });
    });
    req.on('error', (e) => {
        console.error(`Problem with todo request: ${e.message}`);
    });
    req.end();
}

postLogin();
