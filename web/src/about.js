import React from 'react'

const About = () => {
    return (
        <div className="mx-auto card about">
            <h2>
                About
            </h2>
            <p>
                This is a webpage I made because I felt like the possibilities to practice
                Finnish online weren't satisfactory and that I shouldn't be THAT hard to help a bit.
                </p><p>
                Please do keep in mind that I'm neither a web-designer nor a web-developer -
                in fact, this was the first web app in React that I made.
                The quality of the website therefore might not be up to current industry standards.
                </p><p>
                If you notice something's wrong, you can always just send me a message at GitHub (or Reddit)
                and I might try to fix it. Even better, if you actually know how to fix that,
                I would be insanely grateful for a pull request!
            </p>
            <div style={{ height: "100px", padding: "15px" }}>
                <a href="https://github.com/tragram/finnish-inflexion-drill" target="_blank" rel='noopener noreferrer'>
                    <img src={process.env.PUBLIC_URL + "/img/github-logo.png"} style={{ display: "inline-block", height: "100%" }} alt="" />
                </a>
                <a href="https://www.reddit.com/user/tragram" target="_blank" rel='noopener noreferrer'>
                    <img src={process.env.PUBLIC_URL + "/img/reddit-logo.png"} style={{ display: "inline-block", height: "100%", paddingLeft: "30px" }} alt="" />
                </a>
            </div>
        </div>
    )
}

export default About