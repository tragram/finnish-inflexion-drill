import React from 'react'
class UserIO extends React.Component {
    render() {
        // for(let i=100;i>=20;--i){
        //   getTextWidth("päähenkilö",i+"px Comfortaa");
        // }
        function computeFontSize(text, defaultSize, textSpace) {
            const l = text.length;
            const coeffs = [0.885, -0.0811]
            let resizedFontSize = Math.max(Math.min(defaultSize, (textSpace / l + coeffs[1]) / coeffs[0]), defaultSize / 4);
            // console.log("Approximate width default "+(coeffs[0]*defaultSize+coeffs[1])*l+" changed to size "+resizedFontSize+"px and resulting size is "+(coeffs[0]*resizedFontSize+coeffs[1])*l)
            return resizedFontSize;
        }
        return (
            <div className="word-flag">
                <div /*class="card gray"*/>
                    <div className="row card-flex">

                        <div className="l-stretch">
                            <FinnishWord finnish_word={this.props.currentWord} fontSize={computeFontSize(this.props.currentWord, 100, 550)} />
                        </div>

                        <div className="r-stretch">
                            <RightCard text={this.props.currentTranslation} fontSize={computeFontSize(this.props.currentTranslation, 30, 550)} cls='blue' image={process.env.PUBLIC_URL + "/img/translation.svg"} />
                            <RightCard text={this.props.currentFormName} fontSize={computeFontSize(this.props.currentFormName, 30, 550)} cls='red' image={process.env.PUBLIC_URL + "/img/target.svg"} />
                            <RightCard text={this.props.currentKotusType} fontSize={computeFontSize(this.props.currentKotusType, 30, 550)} cls='yellow' image={process.env.PUBLIC_URL + "/img/kotus_type.svg"} />
                            {/* https://en.wiktionary.org/wiki/Appendix:Finnish_nominal_inflection/nuoripari
                https://en.wiktionary.org/wiki/Appendix:Finnish_conjugation */}
                        </div>

                    </div>

                </div>
                <div className="card-flex">
                    <UserTextInput onCorrectAnswer={this.props.onCorrectAnswer} currentWord={this.props.currentWord}
                        currentAnswer={this.props.currentAnswer} />
                </div>
            </div>
        );
    }
}

class UserTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            textInputBG: 'black-bg',
        };
    }

    flicker = (colorCSSClass) => {
        this.setState({ textInputBG: colorCSSClass },
            () => {
                setTimeout(() => {
                    this.setState({ textInputBG: 'black-bg' })
                }, 100);

            });
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (this.props.currentAnswer.includes(this.state.value)) {
                this.props.onCorrectAnswer();
                this.flicker("green-bg");
                this.setState({ value: "" });
            } else {
                this.flicker("red-bg");
            }
        } else if (event.key === ',') {
            let newValue = "";
            for (let i = 0; i <= Math.min(this.state.value.length, this.props.currentAnswer[0].length); ++i) {
                if (i === this.props.currentAnswer[0].length) {
                    newValue = this.props.currentAnswer[0];
                    break;
                }
                else if (this.state.value.len < i || this.state.value[i] !== this.props.currentAnswer[0][i]) {
                    newValue = this.props.currentAnswer[0].slice(0, i + 1);
                    break;
                }
            }
            this.setState({ value: newValue });
        } else if (event.key === '.') {
            this.setState({ value: this.props.currentAnswer[0] });
        } else if (event.key === '/') {
            this.props.onCorrectAnswer();
        }
    }
    render() {
        return (
            <div className="word-input-flex">
                <input type="text" className={"word-input " + this.state.textInputBG}
                    placeholder={"type '" + this.props.currentWord + "' in the form specified"} onKeyPress={this.handleKeyPress}
                    onChange={(evt) => { this.setState({ value: evt.target.value.replace(/[^A-Za-zäöÄÖšž]/g, "") }); }}
                    ref={this.props.reference} autoFocus value={this.state.value} />
            </div>
        )
    }
}

function FinnishWord(props) {
    const style = {
        fontSize: props.fontSize + "px",
    }
    return (
        <div className="card word-card lcard card-text ltext"><p className="" style={style}>{props.finnish_word}</p></div>
    )
}

function RightCard(props) {
    const style = {
        fontSize: props.fontSize + "px",
    }
    return (
        <div className={"container card word-card rcard " + props.cls}>
            <div className="row no-gutters align-items-center h-100">
                <div className="col-sm-1">
                    <img className="rcard-image" alt="" src={props.image} />
                </div>
                <div className="col-sm-11 ">
                    <p className="card-text rtext" style={style}>{props.text}</p>
                </div>
            </div>
        </div>
    )
}

export default UserIO