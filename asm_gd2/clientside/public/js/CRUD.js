const getSource = async () => {
    try {
        const res = await fetch(`http://localhost:3005/source`);
        const data = await res.json();
        return data;
    }
    catch (error) {
        return error;
    }
};
const getUser = async () => {
    try {
        const res = await fetch(`http://localhost:3005/users`);
        const data = await res.json();
        return data;
    }
    catch (error) {
        return error;
    }
};
const PostNewHistory = async (countdown, level, score) => {
    try {
        const data = {
            username: "nvm",
            countdown,
            level,
            score
        };
        const res = await fetch('http://localhost:3005/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const response = await res.json();
        return response;
    }
    catch (error) {
        return error;
    }
};
export { getSource, getUser, PostNewHistory };
