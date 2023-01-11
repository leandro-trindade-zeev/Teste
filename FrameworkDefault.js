var Zeev = {
    Resources: {
        Native: {
        },
        VariablesCustom: {
            ActionClickButton: null,
            Environments: ['dev', 'hml', 'prd'],
            TimeOut: 200,
            CurrentFocus: null
        },
        Functions: {
            MapNativeResources: () => {
                Zeev.Resources.Native.MessageContainer = new Zeev.Form.Functions.CreateElementMapping('#containerMessages');
                Zeev.Resources.Native.ECMLibraries = new Zeev.Form.Functions.CreateElementMapping('#ContainerRelatedLibraries');
                Zeev.Resources.Native.Loader = new Zeev.Form.Functions.CreateElementMapping('.app-overlay');
                Zeev.Resources.Native.Task = new Zeev.Form.Functions.CreateElementMapping('#inpDsFlowElementAlias');
                Zeev.Resources.Native.CodFlowExecuteUID = new Zeev.Form.Functions.CreateElementMapping('#inpCodFlowExecuteUID');
                Zeev.Resources.Native.CodFlowExecuteTask = new Zeev.Form.Functions.CreateElementMapping('#inpCodFlowExecuteTask');
                Zeev.Resources.Native.CodFlowExecute = new Zeev.Form.Functions.CreateElementMapping('#inpCodFlowExecute');
                Zeev.Resources.Native.CodFlow = new Zeev.Form.Functions.CreateElementMapping('#inpCodFlowExecute');
                Zeev.Resources.Native.ActorName = new Zeev.Form.Functions.CreateElementMapping('#inpDsActorName');
            }
        }
    },
    Form: {
        Fields: {},
        Tables: {},
        Buttons: {},
        Events: {},
        Functions: {
            CreateElementMapping: function (fldSelector) {
                try {
                    if (Zeev.Form.Functions.IsNodeList(document.querySelectorAll(fldSelector)) && document.querySelectorAll(fldSelector).length == 0)
                        return null;
                    else if (document.querySelectorAll(fldSelector).length > 1) {
                        this.element = document.querySelectorAll(fldSelector);
                    } else {
                        this.element = document.querySelector(fldSelector);
                        if (this.element == null) {
                            fldSelector = fldSelector + '-1';
                            this.element = document.querySelector(fldSelector);
                        }
                    }
                } catch (ex) {
                    cryo_alert('Houve um problema ao carregar o formulário, atualize a tela ou contate o administrador.');
                    Zeev.System.Functions.WriteLogConsole('Campo não encontrado ' + fldSelector, ex);
                    return;
                }

                this.originalDisplay = document.querySelector(fldSelector).tagName == 'TABLE' ? 'table' : document.querySelector(fldSelector).style.display;
                this.originalMandatory = "";

                this.DontShow = (cleanValues = false) => {
                    var _thisElement = this.element;

                    if (Zeev.Form.Functions.IsNodeList(this.element)) {

                        _thisElement.forEach((element) => {
                            element.style.display = 'none';
                        });

                        _thisElement = _thisElement[0];
                    }
                    else
                        _thisElement.style.display = 'none';

                    if (((_thisElement.tagName == 'INPUT') || (_thisElement.tagName == 'SELECT') || (_thisElement.tagName == 'TEXTAREA'))) {
                        var tr = _thisElement.closest('tr');

                        if (tr) {
                            tr.style.display = 'none';
                            this.DontRequire();
                        }

                        if (cleanValues)
                            this.CleanValue();

                    } else if (_thisElement.tagName == 'TABLE') {
                        let i = 0;
                        if (_thisElement.getAttribute("mult") == "S") {
                            if (cleanValues) {
                                //Apaga as linhas da tabela exceto a primeira.
                                Array.from(_thisElement.tBodies[0].rows).forEach(row => {
                                    if (i > 1)
                                        execv2.form.multipletable.deleteRow(row.querySelector('[id="btnDeleteRow"]'));
                                    i++;
                                });
                            }
                        }
                        if (cleanValues) {
                            //Apaga os valores dos campos dentro da tabela.
                            Array.from(_thisElement.tBodies[0].rows).forEach(row => {
                                var inputs = row.querySelectorAll('input');
                                var selects = row.querySelectorAll('select');
                                var textareas = row.querySelectorAll('textarea');
                                //Apaga os valores dos inputs
                                if (inputs.length > 0) {
                                    Array.from(inputs).forEach(obj => {
                                        var type = obj.getAttribute("type");
                                        var xtype = obj.getAttribute("xtype");
                                        if (type && type.toUpperCase() != "BUTTON" && type.toUpperCase() != "HIDDEN") {
                                            if (type.toUpperCase() == "TEXT")
                                                obj.value = '';
                                            if (type.toUpperCase() == "RADIO" || type.toUpperCase() == "CHECKBOX")
                                                obj.checked = false;
                                            if (xtype && xtype.toUpperCase() == "FILE") {
                                                var btnDelFile = row.querySelector("[title='Excluir']");
                                                if (btnDelFile)
                                                    btnDelFile.click();
                                            }
                                        }
                                    });
                                }
                                //Faz as regras para os selects
                                if (selects.length > 0) {
                                    Array.from(selects).forEach(obj => {
                                        obj.value = "";
                                    });
                                }
                                //Faz as regras para os textareas
                                if (textareas.length > 0) {
                                    Array.from(textareas).forEach(obj => {
                                        obj.value = "";
                                    });
                                }
                            });
                        }
                    }
                    return this;
                };
                this.Reveal = () => {
                    var _thisElement = this.element;
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        _thisElement.forEach((element) => {
                            element.style.display = '';
                        });
                        _thisElement = _thisElement[0];
                    }
                    else if (!(_thisElement.getAttribute('xtype') == 'FILE')) {
                        _thisElement.style.display = '';
                    }

                    if (((_thisElement.tagName == 'INPUT') || (_thisElement.tagName == 'SELECT') || (_thisElement.tagName == 'TEXTAREA'))) {
                        var tr = _thisElement.closest('tr');
                        if (tr)
                            tr.style.display = '';
                    }
                    return this;
                };
                this.DontRequire = () => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            _removeRequire(element);
                        });
                    } else {
                        _removeRequire(this.element);
                    }

                    function _removeRequire(element) {
                        if (((element.tagName == 'INPUT') || (element.tagName == 'SELECT') || (element.tagName == 'TEXTAREA'))) {
                            element.setAttribute('required', 'N');
                            element.setAttribute('data-required', 'false');
                            Zeev.Form.Functions.ZeevClosest(element, 'tr').classList.remove('execute-required');
                        }
                    }

                    return this;
                };
                this.Require = () => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            _setRequire(element);
                        });
                    } else {
                        _setRequire(this.element);
                    }

                    function _setRequire(element) {
                        if (((element.tagName == 'INPUT') || (element.tagName == 'SELECT') || (element.tagName == 'TEXTAREA'))) {
                            element.setAttribute('required', 'S');
                            element.setAttribute('data-required', 'true');
                            Zeev.Form.Functions.ZeevClosest(element, 'tr').classList.add('execute-required');
                        }
                    }

                    return this;
                };
                this.ReadOnly = () => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            if ((element.type.toUpperCase() == 'RADIO') || (element.type.toUpperCase() == 'CHECKBOX')) {
                                var tr = Zeev.Form.Functions.ZeevClosest(element, 'tr');
                                tr.classList.add('readOnlyType');
                            }
                        });
                    }
                    if (((this.element.tagName == 'INPUT') || (this.element.tagName == 'TEXTAREA'))) {
                        this.element.readOnly = true;
                    }
                    if (this.element.tagName == 'SELECT') {
                        this.element.classList.add('readOnlyType');
                    }
                    return this;
                };
                this.ReadEdit = () => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            if ((element.type.toUpperCase() == 'RADIO') || (element.type.toUpperCase() == 'CHECKBOX')) {
                                var tr = Zeev.Form.Functions.ZeevClosest(element, 'tr');
                                tr.classList.remove('readOnlyType');
                            }
                        });
                    }
                    if (((this.element.tagName == 'INPUT') || (this.element.tagName == 'TEXTAREA'))) {
                        this.element.readOnly = false;
                    }
                    if (this.element.tagName == 'SELECT') {
                        this.element.classList.remove('readOnlyType');
                    }
                    return this;
                };
                this.OnClick = (newClick) => {
                    if (!newClick)
                        return;
                    var oldClick = this.element.onclick;
                    var clickFunction = () => {
                        var result = newClick();
                        if (result)
                            result = oldClick();
                        return result;
                    }
                    this.element.onclick = clickFunction;
                };
                this.OnChange = (newFunction) => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            element.onchange = newFunction;
                        });
                    } else {
                        this.element.onchange = newFunction;
                    }
                    return this;
                };
                this.OnBlur = (newFunction) => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            element.onblur = newFunction;
                        });
                    } else {
                        this.element.onblur = newFunction;
                    }
                    return this;
                };
                this.TriggerChange = () => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        var chk = false;
                        this.element.forEach((element) => {
                            if (element.checked) {
                                chk = true;
                                element.dispatchEvent(new Event('change'));
                            }
                        });
                        if (!chk) this.element[0].dispatchEvent(new Event('change'));
                    } else {
                        this.element.dispatchEvent(new Event('change'));
                    }
                    return this;
                };
                this.GetValue = ((field) => {
                    var defaultGetValueFunction = () => { return field.element.value; };
                    if (field.element.type == 'select-one')
                        field.options = Array.from(field.element.options);
                    if (Zeev.Form.Functions.IsNodeList(field.element)) {
                        field.options = document.querySelectorAll(fldSelector);
                        if (field.element[0].type == 'checkbox' || field.element[0].getAttribute('xtype') == 'CHECKBOX')
                            defaultGetValueFunction = () => {
                                var values = [];
                                Array.from(field.options).filter((checkbox) => {
                                    values.push({ value: checkbox.value, checked: checkbox.checked, type: checkbox.type });
                                });
                                return values;
                            };
                        if (field.element[0].type == 'radio')
                            defaultGetValueFunction = () => {
                                var selected = document.querySelector(fldSelector + ':checked');
                                if (selected)
                                    return selected.value;
                                else
                                    return null;
                            };
                    }
                    return defaultGetValueFunction;
                })(this);
                this.GetDescription = () => {
                    var description = this.GetValue();
                    if (this.element.type == 'select-one')
                        description = this.element.options[this.element.selectedIndex].text
                    if (this.element.type == 'hidden' && this.element?.attributes['data-fieldformat']?.value == 'SELECT')
                        description = this.element.parentElement.querySelector('div').textContent;
                    return description
                };
                this.CleanValue = () => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            if ((element.type.toUpperCase() == 'RADIO') || (element.type.toUpperCase() == 'CHECKBOX')) {
                                element.checked = false;
                            }
                        });
                    }
                    else if ((this.element.getAttribute('xtype').toUpperCase() == 'FILE')) {
                        var btnDelFile = this.element.parentElement.querySelector("[title='Excluir']");
                        if (btnDelFile)
                            btnDelFile.click();
                    }
                    else if (((this.element.tagName == 'INPUT') || (this.element.tagName == 'SELECT') || (this.element.tagName == 'SELECT-ONE') || (this.element.tagName == 'TEXTAREA'))) {
                        let type = this.element.getAttribute('type') ? this.element.getAttribute('type') : this.element.attributes.xtype.value;
                        if (type && type.toUpperCase() != "BUTTON" && type.toUpperCase() != "HIDDEN")
                            this.element.value = "";
                    }
                };
                this.Filter = (itensName = '') => {
                    let itens = [];
                    let itensFields = [];
                    let positionIni = 0;

                    if (itensName.trim().length > 0)
                        itens = itensName.split(',');

                    if (this.element.tagName == 'SELECT') {
                        positionIni = 1;
                        itensFields = this.element.options;
                    } else if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        itensFields = this.element;
                    }

                    _hideOptionsAll(itensFields, positionIni);
                    _showOptionsFilter(itensFields, itens);

                    function _showOptionsFilter(itensFields, itensName) {
                        if (itensFields && itensName) {
                            if (itensName.length > 0) {
                                itensName.forEach(name => {
                                    for (let i = 0; i < itensFields.length; i++) {
                                        if (itensFields[i].value.toLocaleLowerCase() == name.toLocaleLowerCase()) {
                                            if (itensFields[i].getAttribute('type') == 'radio' || itensFields[i].getAttribute('type') == 'checkbox') {
                                                Zeev.Form.Functions.ZeevClosest(itensFields[i], 'div').style.display = 'block';
                                            } else {
                                                itensFields[i].style.display = 'block';
                                            }
                                        }
                                    }
                                });
                            } else {
                                for (let i = 0; i < itensFields.length; i++) {
                                    if (itensFields[i].getAttribute('type') == 'radio' || itensFields[i].getAttribute('type') == 'checkbox') {
                                        Zeev.Form.Functions.ZeevClosest(itensFields[i], 'div').style.display = 'block';
                                    } else {
                                        itensFields[i].style.display = 'block';
                                    }
                                }
                            }
                        }
                    }
                    function _hideOptionsAll(itensFields, positionIni) {
                        if (itensFields) {
                            for (let i = positionIni; i < itensFields.length; i++) {
                                if (itensFields[i].getAttribute('type') == 'radio' || itensFields[i].getAttribute('type') == 'checkbox') {
                                    Zeev.Form.Functions.ZeevClosest(itensFields[i], 'div').style.display = 'none';
                                } else {
                                    itensFields[i].style.display = 'none';
                                }
                            }
                        }
                    }
                }
            },
            IsNodeList: (nodes) => {
                var stringRepr = Object.prototype.toString.call(nodes);
                return typeof nodes === 'object' &&
                    /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
                    (typeof nodes.length === 'number') &&
                    (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
            },
            ZeevClosest: (obj, el) => {
                if (obj) {
                    if (obj.nodeName == el.toUpperCase())
                        return obj;
                    else
                        return obj.parentElement.closest(el);
                } else {
                    return null;
                }
            },
            ValidateEnvironment: () => {
                if (!Form.VariablesCustom.Environments.includes(Form.Settings.Environment))
                    cryo_alert(`Atenção, o ambiente <b>${environment}</b> configurado em script não foi encontrado, as integrações podem não funcionar corretamente !`)
            },
            HideAllGroupments: () => {
                Object.getOwnPropertyNames(Zeev.Form.Fields).forEach((groupName) => {
                    Zeev.Form.Functions.HideAllFields(Zeev.Form.Fields[groupName]);
                    Zeev.Form.Fields[groupName].DontShow();
                });
                if (Zeev.Form.Tables)
                    Object.getOwnPropertyNames(Zeev.Form.Tables).forEach((name) => {
                        if (Zeev.Form.Tables[name])
                            Zeev.Form.Tables[name].DontShow();
                    });
            },
            GetAllFields: () => {
                return Object.getOwnPropertyNames(Form.Fields.DadosSolicitante).filter((field) => {
                    if (!Form.VariablesCustom.ValueException.includes(field))
                        return field;
                });
            },
            HideAllFields: (groupment) => {
                Object.getOwnPropertyNames(groupment).filter((field) => {
                    if (field != 'DontShow' && field != 'Reveal' && field != 'HideAllFields' && field != 'ShowAllFields' && groupment[field].DontShow != undefined)
                        groupment[field].DontShow();
                });
            },
            CleanAllGroupments: (fieldException = null) => {
                Object.getOwnPropertyNames(Form.Fields).forEach((name) => {
                    Form.Functions.CleanAllFields(Form.Fields[name], fieldException);
                });
            },
            CleanAllFields: (groupment, fieldException = []) => {
                Object.getOwnPropertyNames(groupment).filter((field) => {
                    if (!Form.VariablesCustom.ValueException.includes(field) && field && groupment[field].DontShow != undefined && !fieldException.includes(groupment[field]))
                        groupment[field].CleanValue();
                });
            },
            CleanHideFields: (groupment, fieldException = []) => {
                Object.getOwnPropertyNames(groupment).filter((field) => {
                    if (!Form.VariablesCustom.ValueException.includes(field) && field && groupment[field].DontShow != undefined && !fieldException.includes(groupment[field]) && Form.Functions.VerifyHideField(groupment[field]))
                        groupment[field].CleanValue();
                });
            },
            VerifyHideField: (field) => {
                var result = false;
                if (Form.Functions.IsNodeList(field.element)) {
                    if (field.element[0].closest('tr').style.display == 'none')
                        result = true;
                } else if (field.element.closest('tr').style.display == 'none') {
                    result = true;
                }
                return result;
            },
            ShowAllFields: (groupment) => {
                Object.getOwnPropertyNames(groupment).filter((field) => {
                    if (field != 'DontShow' && field != 'Reveal' && field != 'HideAllFields' && field != 'ShowAllFields')
                        groupment[field].Reveal();
                });
            },
            AddGrouping: (groupmentId, groupmentName = undefined, fields) => {
                function toPropertyName(string) {
                    var s = string.replace(/\W+(.)/g, function (match, chr) {
                        return chr.toUpperCase();
                    });
                    return s.charAt(0).toUpperCase() + s.slice(1);
                }

                if (!groupmentName)
                    groupmentName = groupmentId;

                var groupmentName = toPropertyName(groupmentName);
                var groupElement = document.querySelector('table[id="' + groupmentId + '"');
                Zeev.Form.Fields[groupmentName] = {};
                Zeev.Form.Fields[groupmentName].DontShow = () => { if (groupElement) Zeev.Form.Functions.ZeevClosest(document.querySelector('table[id="' + groupmentId + '"'), 'tr').style.display = 'none'; };
                Zeev.Form.Fields[groupmentName].Reveal = () => { if (groupElement) Zeev.Form.Functions.ZeevClosest(document.querySelector('table[id="' + groupmentId + '"'), 'tr').style.display = ''; };
                Zeev.Form.Fields[groupmentName].HideAllFields = () => { Zeev.Form.Functions.HideAllFields(Zeev.Form.Fields[groupmentName]) };
                Zeev.Form.Fields[groupmentName].ShowAllFields = () => { Zeev.Form.Functions.ShowAllFields(Zeev.Form.Fields[groupmentName]) };
                fields.forEach((fieldName) => {
                    Zeev.Form.Fields[groupmentName][toPropertyName(fieldName)]
                        = new Zeev.Form.Functions.CreateElementMapping('[xname=inp' + fieldName + ']');
                });
            },
            //listOfDates=[Date]; type='max' ou type='min'
            //Ex: GetMaxOrMiniDate([Date]) return maxDate || GetMaxOrMiniDate([Date], 'min') return minDate
            GetMaxOrMiniDate: (listOfDates, type = 'max') => {
                let dt;

                if (listOfDates && listOfDates.length > 0) {
                    if (type.toLowerCase() == 'max') {
                        //pega a maior data
                        dt = new Date(Math.max(...listOfDates));
                    } else {
                        dt = new Date(Math.min(...listOfDates));
                    }
                }

                return dt.toLocaleDateString('pt-BR');
            },
            //date='01/01/2000';days=10,listHolidays=[{desc:"Carnaval", date="12-25" mes-dia '}]
            AddWorkingDays: (date, days, listHolidays) => {
                function _calcNewDate(date, days, direction, listHolidays) {
                    var holidays = false;

                    if (days == 0) {
                        return date;
                    }

                    // adiciona/subtrai um dia 
                    date.addDays(direction);

                    //Verifica se o dia é util
                    var isFimDeSemana = date.getDay() in { 0: 'Sunday', 6: 'Saturday' };

                    listHolidays.forEach(h => {
                        let dateHoliday = new Date(`${date.getFullYear().toString()}-${h.date}`);
                        dateHoliday.setDate(dateHoliday.getDate() + 1);

                        if (dateHoliday.toLocaleDateString('pt-br') == date.toLocaleDateString('pt-br')) {
                            holidays = true;
                        }
                    });

                    //Se for util remove um dia 
                    if ((!isFimDeSemana && !holidays)) {
                        days--;
                    }

                    return _calcNewDate(date, days, direction, listHolidays);
                }

                var newDate = new Date(date.toDate().valueOf());
                var remainingWorkingDays;
                var direction;

                // Remove decimais 
                if (days !== parseInt(days, 10)) {
                    throw new TypeError('AddWorkingDays utiliza apenas dias uteis.');
                }

                // Se zero dias, não realiza mudança 
                if (days === 0) { return '' };

                //Decide soma ou subtração 
                direction = days > 0 ? 1 : -1;

                //decide numero de iterações
                remainingWorkingDays = Math.abs(days);

                // Chamada recursiva
                newDate = _calcNewDate(newDate, remainingWorkingDays, direction, listHolidays);

                return newDate.toLocaleDateString('pt-BR');
            },
            CreatedChecked: function (id, txt, fun) {
                let label = document.createElement('label');
                label.setAttribute('for', id);
                label.classList.add('checkbox');

                let checkbox = document.createElement('input');
                checkbox.setAttribute('id', id);
                checkbox.setAttribute('value', txt);
                checkbox.setAttribute('type', 'checkbox');

                if (fun) checkbox.setAttribute('onclick', fun);

                label.appendChild(checkbox);
                label.append(txt);

                return label;
            },
            Tables: {
                AddActive: (item) => {
                    if (!item)
                        return;
                    Zeev.Form.Functions.RemoveActive(item);
                    if (Zeev.Resources.VariablesCustom.CurrentFocus >= item.length)
                        Zeev.Resources.VariablesCustom.CurrentFocus = 0;
                    if (Zeev.Resources.VariablesCustom.CurrentFocus < 0)
                        Zeev.Resources.VariablesCustom.CurrentFocus = (item.length - 1);
                    item[Zeev.Resources.VariablesCustom.CurrentFocus].classList.add("autocomplete-active");
                },
                RemoveActive: (item) => {
                    for (var i = 0; i < item.length; i++) {
                        item[i].classList.remove("autocomplete-active");
                    }
                },
                CloseAllLists: (element) => {
                    var item = document.getElementsByClassName("autocomplete-items");
                    for (var i = 0; i < item.length; i++) {
                        if (element != item[i])
                            item[i].parentNode.removeChild(item[i]);
                    }
                },
                CheckIfFieldIsFill: (field) => {
                    setTimeout(() => {
                        if (!Zeev.Resources.VariablesCustom[`${field.attributes['name'].value}Control`])
                            field.value = '';
                        Zeev.Form.Functions.Tables.CloseAllLists()
                    }, 300)
                },
                KeyListControl: () => {
                    var sugestionList = document.getElementById(event.target.id + "autocomplete-list");
                    if (sugestionList) sugestionList = sugestionList.getElementsByTagName("div");
                    if (event.keyCode == 40) {
                        Zeev.Resources.VariablesCustom.CurrentFocus++;
                        Zeev.Form.Functions.AddActive(sugestionList);
                    } else if (event.keyCode == 38) {
                        Zeev.Resources.VariablesCustom.CurrentFocus--;
                        Zeev.Form.Functions.AddActive(sugestionList);
                    } else if (event.keyCode == 13) {
                        event.preventDefault();
                        if (Zeev.Resources.VariablesCustom.CurrentFocus > -1) {
                            if (sugestionList) sugestionList[Zeev.Resources.VariablesCustom.CurrentFocus].click();
                        }
                    }
                },
                CreateSugestionList: async (field, dataSource, body) => {
                    var searchValue = field.value;
                    var xName = field.attributes['xname'].value
                    if (!searchValue || searchValue.length <= 3)
                        return;
                    var inp = field;
                    Zeev.Form.Functions.Tables.CloseAllLists(inp);
                    Zeev.Resources.VariablesCustom[`${field.attributes['name'].value}Control`] = false;
                    Zeev.Resources.VariablesCustom.CurrentFocus = -1;
                    var div = document.createElement("DIV");
                    div.setAttribute("id", field.id + "autocomplete-list");
                    div.setAttribute("class", "autocomplete-items");
                    field.parentNode.appendChild(div);
                    body.inpfilterValue = searchValue.toUpperCase();
                    var itemList = await Zeev.Form.Functions.Tables.GetItemList(body, searchValue, dataSource, xName);
                    if (!itemList) {
                        cryo_alert('Dados não localizados.');
                        return;
                    }
                    if (Array.isArray(itemList))
                        itemList.forEach((item) => { Zeev.Form.Functions.Tables.CreateOptions(div, item, inp, searchValue) })
                    else
                        Zeev.Form.Functions.Tables.CreateOptions(div, itemList, inp, searchValue);
                },
                GetItemList: async (body, searchValue, dataSource, xName) => {
                    return await Zeev.Integration.Functions.ExecuteDataSource(dataSource, body)
                        .then(result => {
                            return result;
                        });
                },
                CreateOptions: (div, item, inp, val) => {
                    var innerDiv = document.createElement("DIV");
                    innerDiv.innerHTML += `${item.cod.replace(val.toUpperCase(), '<strong>' + val.toUpperCase() + '</strong>')} - ${item.txt.replace(val.toUpperCase(), '<strong>' + val.toUpperCase() + '</strong>')}`;
                    innerDiv.innerHTML += `<input type='hidden' id='inpText' value='${item.txt}'>`;
                    innerDiv.innerHTML += `<input type='hidden' id='inpCode' value='${item.cod}'>`;
                    Object.entries(item.fields).forEach((fld) => {
                        innerDiv.innerHTML += `<input type='hidden' id='inp${fld[0]}' value='${fld[1]}'>`
                    })
                    innerDiv.addEventListener("click", function (e) {
                        inp.value = this.querySelector('#inpText').value;
                        this.querySelectorAll('input').forEach((inp) => {
                            var inpForm = inp.closest('tr').querySelector(`[xname="${inp.id}"]`);
                            if (inpForm)
                                inpForm.value = inp.value;
                        })
                        Zeev.Resources.VariablesCustom[`${inp.attributes['name'].value}Control`] = true;
                        Zeev.Form.Functions.Tables.CloseAllLists(inp);
                    });
                    div.appendChild(innerDiv);
                },
                TableAppears: (table) => {
                    return !(table.element.querySelectorAll('input[type=hidden]').length == table.element.querySelectorAll('input,select').length)
                }
            }
        }
    },
    Integration: {
        Settings: {
            TimeOut: 200,
            IsDebug: true,
            Environments: ['dev', 'hml', 'prd'],
        },
        DataSources: {},
        Functions: {
            AddDataSource: (name, dataSource) => {
                Zeev.Integration.DataSources[name] = dataSource;
            },
            BuildParamsToGetDataSource: ((params) => {
                var resultParams = '?';
                Object.entries(params).forEach((field, index) => {
                    resultParams += index > 0 ? '&' : '';
                    resultParams += field[0] + "=" + field[1];
                });
                return resultParams;
            }),
            GetUrlDataSource: ((dataSource) => {
                var urlDataSource = '';
                if (dataSource.value)
                    urlDataSource = dataSource.value;
                else {
                    switch (Integration.Settings.Environments.toUpperCase()) {
                        case 'DEV':
                            urlDataSource = dataSource.valueDev;
                            break;
                        case 'HML':
                            urlDataSource = dataSource.valueHml;
                            break;
                        case 'PRD':
                            urlDataSource = dataSource.valuePrd;
                            break;
                    }
                }
                return urlDataSource;
            }),
            ExecuteDataSource: (async (dataSource, params, methodVerb = "GET") => {
                if (Zeev.Resources.Native.Loader)
                    Zeev.Resources.Native.Loader.element.style.display = 'block';
                var result = '';
                let strParams = '';
                var myHeaders = new Headers();
                var urlDataSource = Zeev.Integration.Functions.GetUrlDataSource(dataSource);
                var requestOptions = '';
                if (methodVerb.toUpperCase() == 'GET') {
                    requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };
                    if (params)
                        strParams = Zeev.Integration.Functions.BuildParamsToGetDataSource(params);
                }
                if (methodVerb.toUpperCase() == 'POST') {
                    requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        redirect: 'follow',
                        body: JSON.stringify(params)
                    };
                }
                var url = urlDataSource + (strParams == '?' ? '' : strParams);
                await fetch(url, requestOptions)
                    .then(response => {
                        const contentType = response.headers.get("content-type");
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            return response.json().then(data => {
                                return data;
                            }).catch(error => {
                                Zeev.System.Functions.WriteLogConsole(`Fonte de dados: ${dataSource.name}`);
                                throw Error(error);
                            });
                        } else {
                            return response.text().then(text => {
                                Zeev.System.Functions.WriteLogConsole(`Fonte de dados: ${dataSource.name}`);
                                throw Error(text);
                            });
                        }
                    })
                    .then(rst => {
                        if (rst != null)
                            result = rst.success.length > 1 ? rst.success : rst.success[0];
                        else
                            result = null;
                    })
                    .catch(error => {
                        if (Zeev.Resources.Native.Loader)
                            Zeev.Resources.Native.Loader.element.style.display = 'none';
                        cryo_alert(`Erro na consulta da Fonte de dados <b>'${dataSource.name}'</b>, ${error}`);
                        Zeev.System.Functions.WriteLogConsole(`Fonte de dados: ${dataSource.name}, ${error}`);
                        throw Error(error);
                    });
                if (Zeev.Resources.Native.Loader)
                    Zeev.Resources.Native.Loader.element.style.display = 'none';
                return result;
            }),
        }
    },
    System: {
        TimeOut: 100,
        IsDebug: false,
        Environment: 'Dev',
        Functions: (() => {
            Date.prototype.addDays = function (days) {
                var date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            }
            String.prototype.toDate = function () {
                var dt = this.split('/');
                return new Date(dt[2], parseInt(dt[1]) - 1, dt[0]);
            }
            String.prototype.toNumber = function () {
                return Number(this.split('.').join('').split(',').join('.'));
            }
            Number.prototype.money = function (decimalPlaces = 2) {
                return this.toLocaleString(undefined, { minimumFractionDigits: decimalPlaces });
            }
            return {
                WriteLogConsole: ((data) => {
                    if (Zeev.System.IsDebug)
                        console.log(data);
                }),
                IncreaseWindowSize: (() => {
                    //Aumenta o tamanho da tela
                    document.getElementById("ContainerForm").parentNode.classList.remove("col-lg-10");
                    document.getElementById("ContainerForm").parentNode.classList.add("col-lg-12");
                }),
                HideBoxCommands: (() => {
                    //Esconde a box do canto esquerdo.
                    document.getElementById("commands").parentNode.style.display = "none";
                }),
                IsNullOrEmptySpace: ((obj) => {
                    var result = true;
                    if (obj != undefined && obj != null) {
                        if (obj.constructor == String && obj.trim() != '' && obj.trim().length > 0)
                            result = false;
                        if (obj.constructor == Object && obj != {})
                            result = false;
                        if (obj.constructor == Array && obj.length > 0)
                            result = false;
                    }
                    return result;
                }),
            }
        })(),
    },
    Controller: {
    }
};