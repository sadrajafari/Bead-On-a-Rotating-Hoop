export default async function post (name, action, radius, gravity, friction, angVel, angPos, velocity, v, theta, id) {
    let url = "https://dynamicslab-fd06e-default-rtdb.firebaseio.com/.json";
    let date = new Date()
    let data = {
        cookie: document.cookie,
        name: name,
        time: (date.toLocaleString() + " " + String(date.getMilliseconds()-10)+" ms"),
        action: action,
        radius: radius,
        gravity: gravity,
        friction: friction,
        angVel: angVel,
        angPos: angPos,
        velocity: velocity,
        v: v,
        theta: theta,

    };

    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
     

}