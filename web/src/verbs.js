import React from 'react'
import WordManager from './word_manager'
import kotusVerbs from './kotus_verbs.json';
import topVerbs from './top_verbs.json'

const persons = ["1st singular", "2nd singular", "3rd singular", "1st plural", "2nd plural", "3rd plural", "passive"];
const tensesMoods = ["present", "perfect", "past", "pluperfect", "conditional",
    "conditional perfect", "imperative", "imperative perfect", "potential", "potential perfect"]
const infinitives = [[["1st"], ["long"]], [["2nd"], ["inessive (-ssA)"]], [["2nd"], ["inessive (-ssA) passive"]],
[["2nd"], ["instructive (-n)"]], [["3rd"], ["inessive (-ssA)"]], [["3rd"], ["elative (-stA)"]],
[["3rd"], ["illative (-Vn)"]], [["3rd"], ["adessive (-llA)"]], [["3rd"], ["abessive (-ttA)"]],
[["3rd"], ["instructive (-n)"]], [["3rd"], ["instructive (-n) passive"]], [["4th"], [""]], [["5th"], [""]]]

const participles = ["present active", "present passive", "past active", "past passive", "agent", "negative"]

// indexes are related to website's inner representation, while offsets (declared later) are related to the JSON data structure
let range = (start, end) => [...Array(end).keys()].slice(start);
let theNextN = (array, n) => range(array[array.length - 1] + 1, array[array.length - 1] + n + 1);

const presentTenseIndexes = range(0, 4 * 7);
const pastTenseIndexes = theNextN(presentTenseIndexes, 4 * 7);
const conditionalIndexes = theNextN(pastTenseIndexes, 4 * 7);
const imperativeIndexes = theNextN(conditionalIndexes, 4 * 6);
const potentialIndexes = theNextN(imperativeIndexes, 4 * 7);
const infinitivesIndexes = theNextN(potentialIndexes, infinitives.length);
const longFirstInfIndex = infinitivesIndexes[0];
const secondInfIndexes = infinitivesIndexes.slice(1, 4);
const thirdInfIndexes = infinitivesIndexes.slice(4, 11);
const fourthInfIndex = infinitivesIndexes[11];
const fifthInfIndex = infinitivesIndexes[12];
const participlesIndexes = theNextN(infinitivesIndexes, participles.length);
const negativeIndexes = [...range(7, 2 * 7), ...range(3 * 7, 4 * 7), ...range(5 * 7, 6 * 7),
...range(7 * 7, 8 * 7), ...range(9 * 7, 10 * 7), ...range(11 * 7, 12 * 7),
...range(12 * 7 + 6, 12 * 7 + 2 * 6), ...range(12 * 7 + 3 * 6, 12 * 7 + 4 * 6),
...range(13 * 7 + 4 * 6, 14 * 7 + 4 * 6), ...range(15 * 7 + 4 * 6, 16 * 7 + 4 * 6)]
const passiveIndexes = [...range(1, 12).map(el => 7 * el - 1), imperativeIndexes[5], imperativeIndexes[11],
imperativeIndexes[17], imperativeIndexes[23], potentialIndexes[6], potentialIndexes[13], potentialIndexes[20],
potentialIndexes[27], infinitivesIndexes[2], infinitivesIndexes[10], participlesIndexes[1], participlesIndexes[3]]
const perfectIndexes = [presentTenseIndexes, pastTenseIndexes, conditionalIndexes, imperativeIndexes, potentialIndexes].map(array => array.slice(array.length / 2, array.length)).flat()

// TODO: all perfect forms
function generateVerbForm(d, i) {
    const negative = ["en ", "et ", "ei ", "emme ", "ette ", "eivät ", "ei "];
    const imperativeNegative = ["älä ", "älköön ", "älkäämme ", "älkää ", "älkööt ", "älköön "];
    const passivePastParticiple = d[d.length - 3][0];
    const activePastParticiple = d[d.length - 4][0];
    const activeParticiplePlural = activePastParticiple.slice(0, activePastParticiple.length - 2) + "eet";
    // console.log(activePastParticiple, activeParticiplePlural)

    const active = !passiveIndexes.includes(i);
    const positive = !negativeIndexes.includes(i);
    const perfect = perfectIndexes.includes(i);

    const present = presentTenseIndexes.includes(i);
    const past = pastTenseIndexes.includes(i);
    const conditional = conditionalIndexes.includes(i);
    const imperative = imperativeIndexes.includes(i);
    const potential = potentialIndexes.includes(i);

    const pastOffset = 9;
    const conditionalOffset = 16;
    const imperativeOffset = 24;
    const potentialOffset = 33;

    if (perfect) {
        let offset;
        let participleRet;
        let ollaRet;
        let negativeRet;
        let augmentedNegative = Array(7).fill("")
        augmentedNegative.push(...negative);
        const ollaPresent = ["olen ", "olet ", "on ", "olemme ", "olette ", "ovat ", "on ", ...Array(7).fill("ole ")];
        const ollaPast = ["olin ", "olit ", "oli ", "olimme ", "olitte ", "olivat ", "oli ", "ollut ", "ollut ", "ollut ", "olleet ", "olleet ", "olleet ", "ollut "];
        const ollaConditional = ["olisin ", "olisit ", "olisi ", "olisimme ", "olisitte ", "olisivat ", "olisi ", ...Array(7).fill("olisi ")];
        const ollaImperative = ["ole ", "olkoon ", "olkaamme ", "olkaa ", "olkoot ", "olkoon ", "ole ", ...Array(5).fill("olko ")];
        const ollaPotential = ["lienen ", "lienet ", "lienee ", "lienemme ", "lienette ", "lienevät ", "lienee ", ...Array(7).fill("liene ")];
        const negativeImperative = [...Array(7).fill(""), "älä ", "älköön ", "älkäämme ", "älkää ", "älkööt ", "älköön "];

        const passiveOffset = 14;
        if (present) { offset = passiveOffset; negativeRet = augmentedNegative[i - offset]; ollaRet = ollaPresent[i - offset]; }
        else if (past) { offset = passiveOffset + pastTenseIndexes[0]; negativeRet = augmentedNegative[i - offset]; ollaRet = ollaPast[i - offset]; }
        else if (conditional) { offset = passiveOffset + conditionalIndexes[0]; negativeRet = augmentedNegative[i - offset]; ollaRet = ollaConditional[i - offset]; }
        else if (imperative) { offset = passiveOffset + imperativeIndexes[0] - 2; negativeRet = negativeImperative[i - offset + 1]; ollaRet = ollaImperative[i - offset]; }
        else if (potential) { offset = passiveOffset + potentialIndexes[0]; negativeRet = augmentedNegative[i - offset]; ollaRet = ollaPotential[i - offset]; }
        else {
            console.log("Error - perfect and not one of the expected tenses!")
        }

        if (((i - offset) % 7 < 3 && !imperative) || (i - offset) % 6 < 2 && imperative) {
            //singular
            participleRet = activePastParticiple;
        } else if (((i - offset) % 7 < 6 && !imperative) || (i - offset) % 6 < 5 && imperative) {
            participleRet = activeParticiplePlural;
        } else {
            participleRet = passivePastParticiple;
        }

        return negativeRet + ollaRet + participleRet;

    }
    else {
        if (present) {
            if (active) {
                if (positive) {
                    // present active positive
                    return d[i];
                } else {
                    // present active negative
                    return negative[i % 7] + d[6];
                }
            } else {
                if (positive) {
                    // present passive positive
                    return d[7];
                } else {
                    // present passive negative
                    return negative[6] + d[8];
                }
            }
        } else if (past) {
            if (active) {
                if (positive) {
                    // past active positive
                    return d[i - pastTenseIndexes[0] + pastOffset];
                } else {
                    let participle;
                    // past active negative
                    if ((i - pastTenseIndexes[0]) % 7 < 3) {
                        participle = activePastParticiple;
                    } else { participle = activeParticiplePlural; }
                    return negative[i - pastTenseIndexes[0] - 7] + participle;
                }
            } else {
                if (positive) {
                    // past passive positive
                    return d[i - pastTenseIndexes[0] + pastOffset];
                } else {
                    // past passive negative
                    return negative[6] + passivePastParticiple;
                }
            }
        } else if (conditional) {
            if (active) {
                if (positive) {
                    // conditional active positive
                    return d[i - conditionalIndexes[0] + conditionalOffset];
                } else {
                    // conditional active negative
                    return negative[i - conditionalIndexes[0] - 7] + d[conditionalOffset + 2];
                }
            } else {
                if (positive) {
                    // conditional passive positive
                    return d[i - conditionalIndexes[0] + conditionalOffset];
                } else {
                    // conditional passive negative
                    return negative[6] + d[i - conditionalIndexes[0] + conditionalOffset - 6];
                }
            }
        } else if (imperative) {
            if (active) {
                if (positive) {
                    // imperative active positive
                    return d[i - imperativeIndexes[0] + imperativeOffset];
                } else {
                    // imperative active negative
                    if ((i - imperativeIndexes[0] - 6) === 0) {
                        // 2sg
                        return imperativeNegative[i - imperativeIndexes[0] - 6] + d[i - imperativeIndexes[0]];
                    } else {
                        // other
                        return imperativeNegative[i - imperativeIndexes[0] - 6] + d[imperativeOffset + 6];
                    }
                }
            } else {
                if (positive) {
                    // imperative passive positive
                    return d[imperativeOffset + 7];
                } else {
                    // imperative passive negative
                    return imperativeNegative[5] + d[imperativeOffset + 8];
                }
            }
        } else if (potential) {
            if (active) {
                if (positive) {
                    // potential active positive
                    return d[i - potentialIndexes[0] + potentialOffset];
                } else {
                    // potential active negative
                    console.log(i - potentialIndexes[0] - 7)
                    return negative[i - potentialIndexes[0] - 7] + d[potentialOffset + 6];
                }
            } else {
                if (positive) {
                    // potential passive positive
                    return d[potentialOffset + 7];
                } else {
                    // potential passive negative
                    return negative[6] + d[potentialOffset + 8];
                }
            }
        } else if (i === longFirstInfIndex || i === fifthInfIndex) { console.log("l;"); return d[i - infinitivesIndexes[0] + 42][0]; } else {
            //nominal forms are all written in the JSON
            return d[i - infinitivesIndexes[0] + 42];
        }
    }
}

function verbForms() {
    let forms = [];
    for (let i = 0; i < tensesMoods.length; ++i) {
        for (let k = 0; k < 2; ++k) {
            for (let j = 0; j < persons.length; ++j) {
                if (tensesMoods.slice(0, "imperative".length) === "imperative" && j === 0) { continue; }
                let ending = k === 1 ? " negative" : "";
                forms.push(tensesMoods[i] + " " + persons[j] + ending);
            }
        }
    }
    for (let i = 0; i < infinitives.length; ++i) {
        forms.push(infinitives[i][0] + " infinitive " + infinitives[i][1]);
    }
    for (let i = 0; i < participles.length; ++i) {
        forms.push(participles[i] + " participle");
    }
    return forms;
}

class Verbs extends React.Component {
    constructor(props) {
        super(props);
        this.forms = verbForms();
        this.mode = "verbs";
        this.formSettingsName = this.mode + "On";
        this.dataSettingsName = this.mode + "Data";
        this.state = {
            formsOn: JSON.parse(localStorage.getItem(this.formSettingsName)) || this.forms.length,
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
        console.log(topVerbs["kuulua"]["forms"])
        let text = []
        for (let i = 0; i < 160; ++i) {
            text.push(generateVerbForm(topVerbs["kuulua"]["forms"], i));
        }
        return (
            text.map((el, index) => (<p>{el}</p>))

            // <div>
            //     <WordManager top={topVerbs} kotus={kotusVerbs} forms={this.forms}
            //         currentData={this.state.currentData} formsOn={this.state.formsOn} mode={this.mode}/>
            //     <VerbSettings forms={this.forms} formsOn={this.state.formsOn} onClick={this.switchOnOff} />
            // </div>
        )
    }
}

function VerbSettings(props) {

}

export default Verbs