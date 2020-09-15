import React from 'react'
function Info(props) {
    return (
        <div>
            <div className="card settings">
                <dl>
                    <li>press ',' to show the next letter</li>
                    <li>press '.' to show the answer</li>
                    <li>press '/' to go generate a different word</li>
                    {/* <li>press ';' to generate a different form of the same word</li> - TODO?*/}
                </dl>
            </div>
            <div className="card settings">
            <img src="https://uusikielemme.fi/wp-content/uploads/new-u.png" style={{ "width": "50px" }} /><br/>
                <a href="https://uusikielemme.fi/finnish-grammar/" target="_blank" rel='noopener noreferrer' style={{font: "Comfortaa"}}>Learn more at Uusi kielemme
           (not affiliated in any way)</a>
            </div>
        </div>
    );
}

export default Info