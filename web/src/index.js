import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import data from './kotus_nouns.json';
import * as serviceWorker from './serviceWorker';

const plurality = ['Singular', 'Plural']
const cases = ['nominative', 'accusative', 'genitive', 'partitive',
  'inessive (-ssA)', 'elative (-stA)', 'illative (hVn)',
  'adessive (-llA)', 'ablative (-ltA)', 'allative (-lle)',
  'essive (-nA)', 'translative (-ksi)',
  'instructive (-in)', 'abessive (-ttA)', 'comitative (-ne)']

//nominative sg is trivial and accusative officially does not exist
// and instructive+comitative is only plural
const cases_singular = [...cases.slice(2, 12), cases[13]]

//remove accusative
const cases_plural = [cases[0], ...cases.slice(2, cases.length)]


function FinnishWord(props) {
  return (
    <div className="card word-card lcard card-text ltext"><p className="">{props.finnish_word}</p></div>
  )
}

function RightCard(props) {
  console.log(props.fontSize)
  const style = {
    fontSize: props.fontSize+"em",
  }
  return (
    <div className={"container card word-card rcard " + props.cls}>
      <div className="row no-gutters align-items-center h-100">
        <div className="col-sm-1">
          <img className="rcard-image" src={props.image} />
        </div>
        <div className="col-sm-11 ">
          <p className="card-text rtext" style={style}>{props.text}</p>
        </div>
      </div>
    </div>
  )
}

function addInvalid(onOffValues, singular) {
  const for_comparison = singular ? cases_singular : cases_plural;
  let ret = [];
  let offset = 0;
  for (let i = 0; i < cases.length; ++i) {
    if (for_comparison[i - offset] === cases[i]) {
      ret.push(onOffValues[i - offset]);
    } else {
      ret.push(-1);
      offset++;
    }
  }
  return ret;
}

function indeterminateCheckbox(props) {
  let checked = props.truthArray.reduce((a, b) => a && b)
  let unchecked = props.truthArray.reduce((a, b) => a && !b)
  return (
    <input type="checkbox" id={props.id} checked={checked}
      onChange={() => props.onClick(props.singular, props.index)} />
  )
}

function NounSettings(props) {
  function checkboxes() {
    let temp = [];
    let offsetSg = 0;
    let offsetPl = 0;
    for (let i = 0; i < props.cases.length; ++i) {
      let caseName = props.cases[i];
      const offsetSgCopy = offsetSg;
      const offsetPlCopy = offsetPl;
      temp.push(
        <div className="col-sm-2">
          {caseName}
        </div>)
      if (props.singularCasesOn[i] !== -1) {
        temp.push(
          <div className="col-sm-1 align-self-center">
            <input type="checkbox" id="gg" name="gg" checked={props.singularCasesOn[i]}
              onChange={() => props.onClick(true, i - offsetSgCopy)} />

          </div>);
      }
      else {
        temp.push(
          <div className="col-sm-1 align-self-center">
            <input type="checkbox" id="gg" name="gg" checked={false} readOnly disabled={true} />
          </div>);
        offsetSg++;
      }
      if (props.pluralCasesOn[i] !== -1) {
        temp.push(
          <div className="col-sm-1 align-self-center">
            <input type="checkbox" id="gg" name="gg" checked={props.pluralCasesOn[i]}
              onChange={() => props.onClick(false, i - offsetPlCopy)} />
          </div>);
      }
      else {
        temp.push(
          <div className="col-sm-1 align-self-center">
            <input type="checkbox" id="gg" name="gg" checked={false} readOnly disabled={true} />
          </div>);
        offsetPl++;
      }

      temp.push(
        <div className="col-sm-8">

        </div>);
    }
    return temp;
  }

  function switchAll(singular) {
    return () => {
      if (singular) {
        for (let i = 0; i < cases_singular.length; ++i) {
          props.onClick(singular, i);
        }
      }
      else {
        for (let i = 0; i < cases_plural.length; ++i) {
          props.onClick(singular, i);
        }
      }
      // console.log(props.singularCasesOn)
      // console.log(props.singularCasesOn.reduce((a, b) => a || (b&&b!==-1)))
    }
  }
  // console.log(props.singularCasesOn)
  // console.log(props.singularCasesOn.reduce((a, b) => a || (b&&b!==-1)),false)
  return (
    <div className="row align-items-center">
      <div className="col-sm-2">
        {//TODO: settings image
        }
      </div>
      <div className="col-sm-1">
        <input type="checkbox" id="sg_cb" name="gg" checked={props.singularCasesOn.reduce((a, b) => a || (b && b !== -1), false)} onChange={switchAll(true)} />
        <label htmlFor="sg_cb">Singular</label>
      </div>
      <div className="col-sm-1">
        <input type="checkbox" id="pl_cb" name="gg" checked={props.pluralCasesOn.reduce((a, b) => a || (b && b !== -1), false)} onChange={switchAll(false)} />
        <label htmlFor="pl_cb">Plural</label>
      </div>

      <div className="col-sm-8">
        TBD
      </div>
      {checkboxes()}
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
          placeholder={"type '" + this.props.currentWord + "' in the form specified"} onKeyPress={this.handleKeyPress}
          onChange={(evt) => { this.setState({ value: evt.target.value }); }}
          ref={this.props.reference} autoFocus />
      </div>
    )
  }
}

class WordFlag extends React.Component {
  constructor(props) {
    super(props);
    this.nouns = Object.keys(data);
    this.textRef = React.createRef();
    const singularCasesOn = JSON.parse(localStorage.getItem('singularCasesOn'))||[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    const pluralCasesOn = JSON.parse(localStorage.getItem('pluralCasesOn'))||[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    const [word, ans, form, tran, kotus] = this.generateNewWord(this.nouns, singularCasesOn, pluralCasesOn);
    this.state = {
      currentWord: word,
      currentAnswer: ans,
      currentTranslation: tran,
      currentKotusType: kotus,
      currentFormName: form,
      textInputBG: 'black-bg',
      singularCasesOn: singularCasesOn,
      pluralCasesOn: pluralCasesOn,
    };
    this.checkInput = this.checkInput.bind(this);
    this.flicker = this.flicker.bind(this);
    this.switchOnOff = this.switchOnOff.bind(this);
  }

  generateNewWord(keys, singularCasesOn, pluralCasesOn) {
    const wordIndex = Math.floor(Math.random() * keys.length);
    const singularOn = singularCasesOn.reduce((a, b) => a || b);
    const pluralOn = pluralCasesOn.reduce((a, b) => a || b);
    console.log(singularCasesOn, pluralCasesOn);
    let pluralityIndex;
    if (singularOn && pluralOn) {
      pluralityIndex = Math.floor(Math.random() * 2);
    } else if (singularOn) {
      pluralityIndex = 0;
    } else if (pluralOn) {
      pluralityIndex = 1;
    } else {
      alert("You need to specify at least one case!")
    }

    let caseIndex;
    if (pluralityIndex === 0) {//singular
      let caseOrd = Math.floor(Math.random() * singularCasesOn.reduce((a, b) => a + b));
      for (let i = 0; i < singularCasesOn.length; ++i) {
        if (singularCasesOn[i]) {
          caseOrd--;
        }
        if(caseOrd<0){
          caseIndex=i;
          break;
        }
      }
      // caseIndex = caseOrd+offset;
    } else {//plural
      let caseOrd = Math.floor(Math.random() * pluralCasesOn.reduce((a, b) => a + b));
      for (let i = 0; i < pluralCasesOn.length; ++i) {
        if (pluralCasesOn[i]) {
          caseOrd--;
        }
        if(caseOrd<0){
          caseIndex=i;
          break;
        }
      }
    }
    let picked_form_str;
    if (pluralityIndex === 0) {
      picked_form_str = "Singular " + cases_singular[caseIndex];
    }
    if (pluralityIndex === 1) {
      picked_form_str = "Plural " + cases_plural[caseIndex];
    }
    const formIndex = cases_singular.length * pluralityIndex + caseIndex
    const word = keys[wordIndex];
    console.log("plurality: " + pluralityIndex + " caseIndex: " + caseIndex + " formIndex: " + formIndex)
    console.log(data[word].forms[formIndex]);
    return [word, data[word].forms[formIndex], picked_form_str, data[word].tran, data[word].kotus];
  }

  flicker(colorCSSClass) {
    this.setState({ textInputBG: colorCSSClass },
      () => {
        setTimeout(() => {
          this.setState({ textInputBG: 'black-bg' })
        }, 100);

      });
  }

  switchOnOff(singular, index) {
    // console.log(singular,index)
    if (singular) {
      let newCasesOn = this.state.singularCasesOn;
      newCasesOn[index] = !newCasesOn[index];
      this.setState({
        singularCasesOn: newCasesOn,
      })
      localStorage.setItem('singularCasesOn', JSON.stringify(newCasesOn));
    } else {
      let newCasesOn = this.state.pluralCasesOn;
      newCasesOn[index] = !newCasesOn[index];
      this.setState({
        pluralCasesOn: newCasesOn,
      })
      localStorage.setItem('pluralCasesOn', JSON.stringify(newCasesOn));
    }
  }

  checkInput(user_input) {
    const validNext = (this.state.singularCasesOn.reduce((a, b) => a || b) || this.state.pluralCasesOn.reduce((a, b) => a || b));
    if ((this.state.currentAnswer.includes(user_input) && validNext)) {
      console.log("Correct");
      const [word, ans, form, tran, kotus] = this.generateNewWord(this.nouns, this.state.singularCasesOn, this.state.pluralCasesOn);
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
    if (!validNext) {
      alert("You need to specify at least one case!");
    }
  }

  render() {
    function computeFontSize(text) {
      let l = text.length;
      return Math.max(Math.min(2,(2+33/22 - l/18)),0.6)
    }
    return (
      <div className="word-flag">
        <div /*class="card gray"*/>
          <div className="row card-flex">

            <div className="l-stretch">
              <FinnishWord finnish_word={this.state.currentWord} />
            </div>

            <div className="r-stretch">
              <RightCard text={this.state.currentTranslation} fontSize={computeFontSize(this.state.currentTranslation)} cls='blue' image="translation.svg" />
              <RightCard text={this.state.currentFormName} fontSize={computeFontSize(this.state.currentFormName)} cls='red' image="target.svg" />
              <RightCard text={this.state.currentKotusType} fontSize={computeFontSize(this.state.currentKotusType)} cls='yellow' image="kotus_type.svg" />
              {/* https://en.wiktionary.org/wiki/Appendix:Finnish_nominal_inflection/nuoripari
              https://en.wiktionary.org/wiki/Appendix:Finnish_conjugation */}
            </div>

          </div>

        </div>
        <div className="card-flex">
          <UserTextInput enterCallback={this.checkInput} currentWord={this.state.currentWord}
            reference={this.textRef} background_cls={this.state.textInputBG} />
        </div>
        <div className="card settings mx-auto">
          <NounSettings cases={cases} singularCasesOn={addInvalid(this.state.singularCasesOn, true)}
            pluralCasesOn={addInvalid(this.state.pluralCasesOn, false)} onClick={this.switchOnOff} />
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
