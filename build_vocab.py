import json
import wiktfinnish  # not from pip :(
#python wiktwords data/enwiktionary-latest-pages-articles.xml --out wikt.words --language Finnish --all

with open('data/kotus_types.txt',encoding='utf-8') as txt_file:
    lines=txt_file.read().splitlines()
    kotus_nouns=lines[0].split(',')
    kotus_verbs=lines[1].split(',')

fin_wikt={}
with open('data/wikt.words') as json_file:
    for line in json_file.readlines():
        word_dict=json.loads(line)
        fin_wikt[word_dict['word']]=word_dict

def valid_forms(word):
    # print(word['conjugation'])
    forms=[wiktfinnish.inflect(word['conjugation'][0],("","", form,"","")) for form in wiktfinnish.CASE_FORMS]
    forms=[*forms[2:10],forms[11:13],forms[14],*forms[16:]]
    if len(forms[0])==0:
        return None
    # print([wiktfinnish.inflect(word['conjugation'],("","", form,"","")) for form in wiktfinnish.CASE_FORMS])
    return forms


output={}
for noun in kotus_nouns:
    w=fin_wikt[noun]
    try:
        forms=valid_forms(w)
        tran=w['senses'][0]['glosses'][0]
        kotus=w['conjugation'][0]['template_name'].split('-')[-1]
        if forms is not None:
            output[noun]={'tran': tran, 'kotus': kotus, 'forms': forms}
    except:
        print(w)
with open('data/kotus_nouns.json','w') as out_file:
    json.dump(output,out_file)

quit()

for word in fin_wikt:
    w=fin_wikt[word]
    # print(w['conjugation'])
    if w['pos']=='noun' and w['heads'][0]['template_name']=='fi-noun':
        forms=[wiktfinnish.inflect(w['conjugation'][0],("","", form,"","")) for form in wiktfinnish.CASE_FORMS]
        tran=w['senses'][0]['glosses'][0]
        kotus=w['conjugation'][0]['template_name'].split('-')[-1]
        output[word]={'tran': tran, 'kotus': kotus, 'forms': forms}
with open('data/nouns.json','w') as out_file:
    json.dump(output,out_file)

# template=fin_wikt['kello']['conjugation'][0]
# print(template)
# form=("","", "ptv-sg","","")

# print(wiktfinnish.CASE_FORMS)

# print(wiktfinnish.inflect(template,form))

# testcases = [
#     ["fi-decl-valo", {"1": "val", "2": "", "3": "", "4": "o", "5": "a"},
#      ["", "valo"],
#      ["ine-pl", "valoissa"],
#      [("", "", "tra-pl", "1s", "kO"), "valoikseniko"]]]
# for lst in testcases:
#     name = lst[0]
#     args = lst[1]
#     args = args.copy()
#     args["template_name"] = name
#     for form, result in lst[2:]:
#         if isinstance(form, str):
#             form = ("", "", form, "", "")
#         print(args)
#         print(form)
#         ret = wiktfinnish.inflect(args, form)
#         print(ret)
#         if result not in ret:
#             print(name, args, form)
#             print(form, result, "GOT UNEXPECTED RESULT:", ret)
#             assert result in ret