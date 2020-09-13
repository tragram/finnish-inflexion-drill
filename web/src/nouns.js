import React from 'react'
import WordManager from './word_manager'
import kotusNouns from './kotus_nouns.json';
import topNouns from './top_nouns.json'

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

function nounForms() {
    return [...Array(28).keys()].map(i => (plurality[i >= cases.length ? 1 : 0] + " " + cases[i % cases.length]));
}

class Nouns extends React.Component {
    constructor(props) {
        super(props);
        this.forms = nounForms();
        this.mode = "nouns";
        this.formSettingsName = this.mode + "On";
        this.dataSettingsName = this.mode + "Data";
        this.state = {
            formsOn: JSON.parse(localStorage.getItem(this.formSettingsName)) || [...validSgCases, ...validPlCases],
            currentData: JSON.parse(localStorage.getItem(this.dataSettingsName)) || "top",
        };
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
                <WordManager top={topNouns} kotus={kotusNouns} forms={this.forms} generateForm={generateNounForm}
                    currentData={this.state.currentData} formsOn={this.state.formsOn} mode={this.mode}/>
                <NounSettings forms={this.forms} formsOn={this.state.formsOn} onClick={this.switchOnOff} />
            </div>
        )
    }
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

function generateNounForm(d,i){
    return d[i];
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

export default Nouns
