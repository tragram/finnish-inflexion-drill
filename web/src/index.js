import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import data from './kotus_nouns.json';
import * as serviceWorker from './serviceWorker';

function FinnishWord(props) {
  return (
    <div className="card word-card lcard card-text ltext"><p className="">{props.finnish_word}</p></div>
  )
}

function RightCard(props) {
  return (
    <div className={"container card word-card rcard " + props.cls}>
      <div className="row no-gutters align-items-center h-100">
        <div className="col-sm-1">
          <img className="rcard-image" src={props.image} />
        </div>
        <div className="col-sm-11 ">
          <p className="card-text rtext">{props.text}</p>
        </div>
      </div>
    </div>
  )
}


class UserTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.props.enterCallback(this.state.value);
    }
  }
  render() {
    //{this.props.errorState?"flag-uk.svg":""}
    return (
      <div className="word-input-flex">
      <input type="text" className={"word-input " + this.props.background_cls}
        placeholder="type here the word in the form specified" onKeyPress={this.handleKeyPress}
        onChange={(evt) => { this.setState({ value: evt.target.value }); }}
        ref={this.props.reference} autoFocus/>
        </div>
    )
  }
}

class WordFlag extends React.Component {
  constructor(props) {
    super(props);
    this.nouns = Object.keys(data);
    this.textRef = React.createRef();
    const [word, ans, form, tran, kotus] = this.generateNewWord(this.nouns);
    this.state = {
      currentWord: word,
      currentAnswer: ans,
      currentTranslation: tran,
      currentKotusType: kotus,
      currentFormName: form,
      textInputBG: 'black-bg',
    };
    this.checkInput = this.checkInput.bind(this);
    this.flicker = this.flicker.bind(this);
  }

  generateNewWord(keys) {
    const forms = ['', 'acc-sg', 'gen-sg', 'ptv-sg', 'ine-sg', 'ela-sg', 'ill-sg', 'ade-sg', 'abl-sg', 'all-sg', 'ess-sg', 'tra-sg', 'ins-sg', 'abe-sg', 'nom-pl', 'acc-pl', 'gen-pl', 'ptv-pl', 'ine-pl', 'ela-pl', 'ill-pl', 'ade-pl', 'abl-pl', 'all-pl', 'ess-pl', 'tra-pl', 'abe-pl', 'ins-pl', 'cmt']
    const wordIndex = Math.floor(Math.random() * keys.length);
    const formIndex = Math.floor(Math.random() * 10) + 2;
    const word = keys[wordIndex];
    console.log(forms[formIndex]);
    console.log(data[word].forms[formIndex]);
    return [word, data[word].forms[formIndex], forms[formIndex], data[word].tran, data[word].kotus];
  }

  flicker(color){
    this.setState({ textInputBG: color },
      ()=>{
        setTimeout(()=>{
          this.setState({ textInputBG: 'black-bg' })
        },100);
        
      });
  }

  checkInput(user_input) {
    //TODO: for each of the possible correct forms...
    if (user_input == this.state.currentAnswer) {
      console.log("Correct");
      const [word, ans, form, tran, kotus] = this.generateNewWord(this.nouns);
      this.setState({
        currentWord: word,
        currentAnswer: ans,
        currentTranslation: tran,
        currentKotusType: kotus,
        currentFormName: form,
      });
      this.textRef.current.value = '';
      this.flicker("green-bg")
    } else {
      this.flicker("red-bg")
    }
  }

  render() {
    return (
      <div className="word-flag">
        <div /*class="card gray"*/>
          <div className="row card-flex">

            <div className="l-stretch">
              <FinnishWord finnish_word={this.state.currentWord} />
            </div>

            <div className="r-stretch">
              <RightCard text={this.state.currentTranslation} cls='blue' image="translation.svg" />
              <RightCard text={this.state.currentFormName} cls='red' image="target.svg" />
              <RightCard text={this.state.currentKotusType} cls='yellow' image="kotus_type.svg" />
              {/* https://en.wiktionary.org/wiki/Appendix:Finnish_nominal_inflection/nuoripari
              https://en.wiktionary.org/wiki/Appendix:Finnish_conjugation */}
            </div>

          </div>

        </div>
        <div className="card-flex">
          <UserTextInput enterCallback={this.checkInput} reference={this.textRef} background_cls={this.state.textInputBG} />
        </div>
      </div>

    );
  }
}

ReactDOM.render(
  <WordFlag />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
