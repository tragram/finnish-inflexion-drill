import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import kotusNouns from './kotus_nouns.json';
import topNouns from './top_nouns.json'
import * as serviceWorker from './serviceWorker';

// import './checkbox.css'

const ALWAYS_INVALID = -1;
const plurality = ['singular', 'plural'];
const cases = ['nominative', 'genitive', 'partitive',
  'inessive (-ssA)', 'elative (-stA)', 'illative (-hVn)',
  'adessive (-llA)', 'ablative (-ltA)', 'allative (-lle)',
  'essive (-nA)', 'translative (-ksi)',
  'instructive (-in)', 'abessive (-ttA)', 'comitative (-ne)'];
//nominative sg is trivial and accusative officially does not exist
// and instructive+comitative is only plural
const validSgCases = [ALWAYS_INVALID, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ALWAYS_INVALID, 1, ALWAYS_INVALID];
const validPlCases = cases.map(() => 1)

// const cases_singular = [...cases.slice(2, 12), cases[13]]
// const cases_plural = [cases[0], ...cases.slice(2, cases.length)]


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

function IndeterminateCheckbox(props) {
  let checked = props.truthArray.reduce((a, b) => a && b)
  let unchecked = props.truthArray.reduce((a, b) => a && !b)
  return (
    <input type="checkbox" id={props.id} checked={checked}
      onChange={() => props.onClick(props.singular, props.index)} />
  )
}

function WorkingCheckbox(props) {
  return (
    <input type="checkbox" checked={props.checked}
      onChange={props.onChange} />
  )
}

function GreyedOutCheckbox() {
  return (
    <input type="checkbox" checked={false} readOnly disabled={true} />
  )
}

function CheckboxRow(props) {
  let generateCheckbox = (form, value, onChangeFun) => {
    if (value !== -1) {
      return <WorkingCheckbox key={"checkbox-" + form.replace(" ", "-")}
        checked={value} onChange={onChangeFun} />
    } else {
      return <GreyedOutCheckbox key={"checkbox-" + form.replace(" ", "-")} />
    }
  }

  return (
    <div className="row align-items-center">
      <div className="col-sm-6">
        {props.form}
      </div>
      <div className="col-sm-3">
        {generateCheckbox(props.form + "-sg", props.onSingular, () => props.onClick(props.index))}
      </div>
      <div className="col-sm-3">
        {generateCheckbox(props.form + "-pl", props.onPlural, () => props.onClick(props.index + cases.length))}
      </div>
    </div>
  )
}

function NounSettings(props) {
  function switchAll(singular) {
    return () => {
      let offset = singular ? 0 : cases.length;
      let casesOn = singular ? singularCasesOn : pluralCasesOn;
      let allIndexes = [...Array(cases.length).keys()].map(a => a + offset);
      // console.log(allIndexes)
      if ((singular && (allSingularOn || allSingularOff)) || (!singular && (allPluralOn || allPluralOff))) {
        props.onClick(allIndexes);
      } else {
        props.onClick(allIndexes.filter((a, index) => !casesOn[index] && casesOn[index] !== -1));
      }
    }
  }

  let singularCasesOn = props.formsOn.slice(0, cases.length);
  let allSingularOn = singularCasesOn.reduce((a, b) => a && (b || b === -1), true);
  let allSingularOff = singularCasesOn.reduce((a, b) => a && (!b || b === -1), true);
  let pluralCasesOn = props.formsOn.slice(cases.length);
  let allPluralOn = pluralCasesOn.reduce((a, b) => a && (b || b === -1), true);
  let allPluralOff = pluralCasesOn.reduce((a, b) => a && (!b || b === -1), true);

  return (
    <div className="card settings mx-auto">
      <div className="row">
        <div className="col-sm-5">
          <div className="row">
            <div className="col-sm-6">
              {//TODO: settings image
              }
            </div>
            <div className="col-sm-3 control-group">
              <input type="checkbox" id="sg_cb" onChange={switchAll(true)}
                checked={allSingularOn} />
              <label htmlFor="sg_cb">Singular</label>
            </div>
            <div className="col-sm-3">
              <input type="checkbox" id="pl_cb" onChange={switchAll(false)}
                checked={allPluralOn} />
              <label htmlFor="pl_cb">Plural</label>
            </div>
          </div>


          {props.forms.slice(0, cases.length).map((form, index) => <CheckboxRow key={form}
            form={form.slice("Singular ".length)} onClick={props.onClick} index={index}
            onSingular={singularCasesOn[index]} onPlural={pluralCasesOn[index]} />)}
        </div>
        <div className="col-sm-4">
          <dl>
            <li>press ',' to show the next letter</li>
            <li>press '.' to show the answer</li>
            <li>press '/' to go generate a different word</li>
            {/* <li>press ';' to generate a different form of the same word</li> */}
          </dl>
        </div>
        <div className="col-sm-3">
          <a href="https://uusikielemme.fi/finnish-grammar/" target="_blank" rel='noopener noreferrer'>Learn more at Uusi kielemme
          <img src="https://uusikielemme.fi/wp-content/uploads/new-u.png" style={{ "width": "100px" }} />
           (not affiliated in any way)</a>
        </div>
      </div>
    </div>
  )
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
        if (i===this.props.currentAnswer[0].length){
          newValue=this.props.currentAnswer[0];
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

function getTextWidth(inputText, font) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const width = context.measureText(inputText).width;
  const formattedWidth = Math.ceil(width)// + "px"; 
  console.log(formattedWidth);
}

class WordManager extends React.Component {
  constructor(props) {
    super(props);
    this.topWords = props.top;
    this.kotusWords = props.kotus;
    this.topWordsKeys = Object.keys(this.topWords);
    this.kotusWordsKeys = Object.keys(this.kotusWords);
    this.forms = props.forms;
    this.mode = props.mode;
    this.formSettingsName = this.mode + "On";
    this.dataSettingsName = this.mode + "Data";
    this.state = {
      formsOn: JSON.parse(localStorage.getItem(this.formSettingsName)) || props.defaultForms,
      currentData: JSON.parse(localStorage.getItem(this.dataSettingsName)) || {
        keys: this.topWordsKeys,
        data: this.topWords
      },
      currentWord: "",
      currentAnswer: "",
      currentTranslation: "",
      currentKotusType: "",
      currentFormName: "",
    };


  }
  componentDidMount() {
    this.generateNewWord();
  }

  generateNewWord = () => {
    const wordIndex = Math.floor(Math.random() * this.state.currentData.keys.length);
    const word = this.state.currentData.keys[wordIndex];

    const formsOnCount = this.state.formsOn.map(el => (el && el !== -1 ? el : 0)).reduce((a, b) => a + b);
    let formSubsetIndex = Math.floor(Math.random() * formsOnCount);
    let trueFormIndex = 0;
    for (let i = 0; i < this.forms.length; ++i) {
      if (this.state.formsOn[i] && this.state.formsOn[i] !== -1) {
        formSubsetIndex--;
      }
      if (formSubsetIndex < 0) {
        break;
      }
      trueFormIndex++;
    }

    const currentEntry = this.state.currentData.data[word];
    this.setState({
      currentWord: word,
      currentFormName: this.forms[trueFormIndex],
      currentAnswer: currentEntry.forms[trueFormIndex],
      currentTranslation: currentEntry.tran,
      currentKotusType: currentEntry.kotus
    })
    console.log(currentEntry.forms[trueFormIndex]);
  }

  onCorrectAnswer = () => {
    this.generateNewWord();
  }

  switchOnOff = (indexes) => {
    if (!Array.isArray(indexes)) {
      indexes = [indexes];
    }
    const afterChange = this.state.formsOn.map((el, i) => indexes.includes(i) && el !== -1 ? (!el) : el);
    // console.log(indexes)
    if (afterChange.map(el => ((el && el !== -1) ? el : 0)).reduce((a, b) => a + b) > 0) {
      this.setState({
        formsOn: afterChange
      });
      localStorage.setItem(this.formSettingsName, JSON.stringify(afterChange));
    } else {
      alert('At least one form has to be selected!');
    }
    // console.log(afterChange);
  }

  render() {
    return (
      <div>
        <UserIO onCorrectAnswer={this.onCorrectAnswer} currentWord={this.state.currentWord}
          currentAnswer={this.state.currentAnswer} currentTranslation={this.state.currentTranslation}
          currentKotusType={this.state.currentKotusType} currentFormName={this.state.currentFormName} />
        <NounSettings forms={this.forms} formsOn={this.state.formsOn} onClick={this.switchOnOff} />
      </div>
    )
  }
}

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

function nounForms() {
  return [...Array(28).keys()].map(i => (plurality[i >= cases.length ? 1 : 0] + " " + cases[i % cases.length]));
}

ReactDOM.render(
  <WordManager top={topNouns} kotus={kotusNouns} forms={nounForms()}
    mode={"nouns"} defaultForms={[...validSgCases, ...validPlCases]} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
