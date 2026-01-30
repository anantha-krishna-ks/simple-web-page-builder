
function LMSAPI() {    
    this.objXMLDataModel = XmlHttp.create();
    this.objXMLDataModel.open("GET", requestPath + "/Scripts/LMSDataModel.xml", false);
    this.objXMLDataModel.send(null);
    this.objXMLDataModel = this.objXMLDataModel.responseXML;

    if (navigator.appName == 'Microsoft Internet Explorer') {
        this.objXMLElementValuesDB = new ActiveXObject("Microsoft.XMLDOM");
        this.objXMLElementValuesDB.loadXML("<DataElements></DataElements>");

    }
    else {
        this.objXMLElementValuesDB = XmlDocument.create();
        this.objXMLElementValuesDB.loadXML("<DataElements></DataElements>");
    }

//    this.objXMLElementValuesDB = XmlDocument.create();
//    this.objXMLElementValuesDB.loadXML("<DataElements></DataElements>");

    this.objXMLDataModelErrors = XmlHttp.create();
    this.objXMLDataModelErrors.open("GET", requestPath + "/Scripts/LMS_Errors.xml", false);
    this.objXMLDataModelErrors.send(null);
    this.objXMLDataModelErrors = this.objXMLDataModelErrors.responseXML;

    this.blnInitialized = false;
    this.objXMLElementValues = XmlDocument.create();
    this.objXMLElementValues.loadXML("");
    this.strErrorID = "0";
    this.setInitialData = setInitialData;
    this.strSCOClicked = "";
    try {
        if (currentNodeId > 0) { this.strSCOClicked = currentNodeId; }
    } catch (ex) { }

    this.LmsInitailzeStatus = "false";
    this.LmsFinishStatus = "false";

    //Supported Function Calls 
    this.LMSInitialize = LMSInitialize;
    this.LMSGetValue = LMSGetValue;
    this.LMSSetValue = LMSSetValue;
    this.LMSCommit = LMSCommit;
    this.LMSGetLastError = LMSGetLastError;
    this.LMSGetErrorString = LMSGetErrorString;
    this.LMSGetDiagnostic = LMSGetDiagnostic;
    this.LMSFinish = LMSFinish;
    this.loadDataFromManifest = loadDataFromManifest;
    this.internalLMSSetValueVer1 = internalLMSSetValueVer1;    

    //non SCORM Function Calls
    this.LMSGetValueValidations = LMSGetValueValidations;
    this.LMSSetValueValidations = LMSSetValueValidations;
    this.internalLMSSetValue = internalLMSSetValue;
    this.FindScopeReturn = FindScopeReturn;
    this.validateIndex = validateIndex;
    this.ValidateData = ValidateData;
    this.LMSCommitToDB = LMSCommitToDB;
    this.LMSRetrieveFromDB = LMSRetrieveFromDB;
    this.internalLMSGetValue = internalLMSGetValue;
    this.dealWithSettingObjectives = dealWithSettingObjectives;
}


function LMSInitialize(strEmpty) {
    try {
        if (strEmpty) {
            if (strEmpty.length != 0) { strErrorNumber = this.strErrorID; this.strErrorID = "201"; return "false"; }
        }
        if (!this.blnInitialized) {
            if (currentNodeId > 0)
                this.strSCOClicked = currentNodeId;

            // if( document.getElementById("Courseid")!=null)
            // this.strSCOClicked= document.getElementById("Courseid").value;			

            var objSearchNode = selectSingleNode(this.objXMLElementValuesDB.getElementsByTagName("SCO"), "Id", this.strSCOClicked);
            if (objSearchNode == null) {
                this.objXMLElementValues = XmlDocument.create();
                this.objXMLElementValues.loadXML("<SCO></SCO>");
                var objNewXmlNode = this.objXMLElementValues.getElementsByTagName("SCO")[0];
                var objNewAttribute = this.objXMLElementValues.createAttribute("Id");
                objNewAttribute.value = this.strSCOClicked;
                objNewXmlNode.setAttributeNode(objNewAttribute);
            }
            else {
                this.objXMLElementValues = XmlDocument.create();
                //this.objXMLElementValues.loadXML(objSearchNode.xml.toString());
            }

            this.setInitialData("cmi.core.lesson_status");
            this.setInitialData("cmi.core.entry");
            this.setInitialData("cmi.core.student_id");
            this.setInitialData("cmi.core.student_name");
            this.LmsInitailzeStatus = "true";
            this.blnInitialized = true;
            this.strErrorID = "0";
            return "true";
        }
        else {
            this.LMSFinish();
            this.blnInitialized = false;
            this.LMSInitialize();
            this.strErrorID = "101";
        }
    } catch (ex) { this.strErrorID = "101"; return "false"; }
}


function LMSGetValue(strElementName) {
    try {          
        if (this.blnInitialized == false) { this.strErrorID = "301"; return ""; }
        var strFormattedElementName = formatnTypeElement(strElementName);

        //if the passed value has n instead of integer
        if (strFormattedElementName == false) { this.strErrorID = "401"; return this.strErrorID; }

        if (this.LMSGetValueValidations(strFormattedElementName)) {
            var objSearchNode = null;
            //            if (strFormattedElementName == "cmi.core.score._children")
            //                objSearchNode = selectSingleNode(this.objXMLElementValuesDB.getElementsByTagName("DataElement"), "Name", strElementName);
            //            else if (strFormattedElementName == "cmi.core.student_id")
            //                objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strElementName);
            //            else if (strFormattedElementName == "cmi.core.student_name")
            objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strElementName);
            if (objSearchNode == null) {
                var result = GetDBValue();
                var strReplaceAll = result;
                var intIndexOfMatch = strReplaceAll.indexOf("u003c");
                while (intIndexOfMatch != -1) {
                    strReplaceAll = strReplaceAll.replace("u003c", "<")
                    intIndexOfMatch = strReplaceAll.indexOf("u003c");
                }
                intIndexOfMatch = strReplaceAll.indexOf("u003e");
                while (intIndexOfMatch != -1) {
                    strReplaceAll = strReplaceAll.replace("u003e", ">")
                    intIndexOfMatch = strReplaceAll.indexOf("u003e");
                }
				//Added for Content fixes
				//intIndexOfMatch = strReplaceAll.indexOf("u0026lt;");
                //while (intIndexOfMatch != -1) {
                //    strReplaceAll = strReplaceAll.replace("u0026lt;", "<")
                //    intIndexOfMatch = strReplaceAll.indexOf("u0026lt;");
                //}
				//intIndexOfMatch = strReplaceAll.indexOf("u0026quot;");
                //while (intIndexOfMatch != -1) {
                //   strReplaceAll = strReplaceAll.replace("u0026quot;", '"')
                //    intIndexOfMatch = strReplaceAll.indexOf("u0026quot;");
                //}
				//intIndexOfMatch = strReplaceAll.indexOf("u0026gt;");
                //while (intIndexOfMatch != -1) {
                //    strReplaceAll = strReplaceAll.replace("u0026gt;", ">")
                //    intIndexOfMatch = strReplaceAll.indexOf("u0026gt;");
                //}
				//ends
                intIndexOfMatch = strReplaceAll.indexOf("\\");
                while (intIndexOfMatch != -1) {
                    strReplaceAll = strReplaceAll.replace("\\", "")
                    intIndexOfMatch = strReplaceAll.indexOf("\\");
                }
                intIndexOfMatch = strReplaceAll.indexOf('"');
                if (intIndexOfMatch == 0) {
                    strReplaceAll = strReplaceAll.replace('"', '');
                }
                var strContains = strReplaceAll.match('{"d":"');
                if (strContains != null) {
                    strReplaceAll = strReplaceAll.substring(0, strReplaceAll.length - 2);
                    strReplaceAll = strReplaceAll.substring(6);
                }

                result = strReplaceAll;
                this.objXMLElementValuesDB = LoadXML(result);
                objSearchNode = selectSingleNode(this.objXMLElementValuesDB.getElementsByTagName("DataElement"), "Name", strElementName);
                if (objSearchNode == null)
                    objSearchNode = selectSingleNode(this.objXMLElementValuesDB.getElementsByTagName("DataElement"), "Name", strElementName);
            }
            if (objSearchNode == null) {
                //the element implemented has not been set yet
                //set it to default value if it's scope is not global
                //if it is not of type n elements                 
                if (strFormattedElementName != strElementName) { if (!this.validateIndex(strElementName, "LMSGetValue")) { this.strErrorID = "201"; return ""; } }
                return this.FindScopeReturn(strFormattedElementName, strElementName);
            }
            else { this.strErrorID = "0"; return objSearchNode.attributes.getNamedItem("Value").value; }
        } else { return ""; }
    } catch (ex) { return (objSearchNode.attributes.getNamedItem("Value") != null) ? objSearchNode.attributes.getNamedItem("Value").value : ""; }
}
function GetDBValue() {
    try {        
        var myJson = { userId: CoursePreferences.UserId, contentStructureAssetId: currentNodeId };
        var message = JSON.stringify(myJson, function (key, value) { return value; });
        var response = $.ajax({
            type: "POST",
            data: message,
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: requestPath + "/AjaxMethods.aspx/GetBrowsedStatus"
        });
        if (response.status == 200 && response.readyState == 4) {
            var res = eval('(' + response.responseText + ')')
            if (res.d == "timeout") {
                alertandnavigate();
                return "<DataElement></DataElement>";
            }
            else
                return response.responseText;
        }
        else
            return -1;
        //PageMethods.GetBrowsedStatus(CoursePreferences.Preferences.userid, currentNodeId, SucceededCallback, OnFailed);
    } catch (ex) {
    }
}


function LMSSetValue(strElementName, strValue) {    
    try {
		if(UserType != undefined && UserType == 'parent' && (strElementName == 'cmi.core.lesson_status' || strElementName == 'cmi.core.lesson_location' || strElementName == 'cmi.student_preference.language' || strElementName == 'cmi.core.score.max')) {
			return false;
		}
        try {
            if (strValue == "completed")
                NodeDetails[currentNodeId].iscompleted = "True";
        }
        catch (ex) {
        }
        if (this.blnInitialized == false) { this.strErrorID = "301"; return "false"; }
        //validate criteria to set a value for the given element
        var strFormattedElementName = formatnTypeElement(strElementName);
        //if the passed value has n instead of integer
        if (strFormattedElementName == false) { this.strErrorID = "401"; return "false"; }
        var cannotHaveChildren = false;
        var isNotAnArray = false;
        var invalid = false;
        if (strElementName.indexOf(".") != -1) {
            if (strElementName.indexOf("cmi.objectives") >= 0) {
                return dealWithSettingObjectives(strElementName, strValue, this.objXMLElementValues);
            }
        }
        if (this.LMSSetValueValidations(strFormattedElementName, strValue, strElementName)) {
            var objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strElementName);
            //            if (objSearchNode == null) {
            //                this.objXMLElementValues = (this.objXMLElementValuesDB != null) ? this.objXMLElementValuesDB : this.objXMLElementValues;
            //                objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strElementName);
            //            }
            if (null == objSearchNode) {
                if (strFormattedElementName != strElementName) { if (!this.validateIndex(strElementName, "LMSSetValue")) { this.strErrorID = "201"; return "false"; } }

                //if the element has not been set yet
                //create a node and append to the xml
                var objNewXmlNode = this.objXMLElementValues.createElement("DataElement");
                var objNewAttribute = this.objXMLElementValues.createAttribute("Name");
                objNewAttribute.value = strElementName;
                objNewXmlNode.setAttributeNode(objNewAttribute);
                objNewAttribute = this.objXMLElementValues.createAttribute("Value");
                objNewAttribute.value = strValue;
                objNewXmlNode.setAttributeNode(objNewAttribute);
                if (this.objXMLElementValues.documentElement == null) {
                    this.objXMLElementValues = XmlDocument.create();
                    this.objXMLElementValues.loadXML("<SCO></SCO>");

                    var objNewXmlNode1 = this.objXMLElementValues.getElementsByTagName("SCO")[0];
                    var objNewAttribute1 = this.objXMLElementValues.createAttribute("Id");
                    objNewAttribute1.value = this.strSCOClicked;
                    objNewXmlNode1.setAttributeNode(objNewAttribute1);

                    var objNewXmlNode = this.objXMLElementValues.createElement("DataElement");
                    var objNewAttribute = this.objXMLElementValues.createAttribute("Name");
                    objNewAttribute.value = strElementName;
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    objNewAttribute = this.objXMLElementValues.createAttribute("Value");
                    objNewAttribute.value = strValue;
                    objNewXmlNode.setAttributeNode(objNewAttribute);

                    this.objXMLElementValues.documentElement.appendChild(objNewXmlNode);
                }
                else
                    this.objXMLElementValues.documentElement.appendChild(objNewXmlNode);
                this.strErrorID = "0";
            } else { objSearchNode.attributes.getNamedItem("Value").value = strValue; }

            //additional tasks to be performaed if the element is score.raw			
            if (strElementName == "cmi.core.score.raw") {
                var strCredit = this.LMSGetValue("cmi.core.credit");
                if (strCredit == "credit") {
                    this.masteryScore = this.internalLMSGetValue(this.strSCOClicked, "cmi.student_data.mastery_score")
                    if (parseInt(this.masteryScore) || parseInt(this.masteryScore) == 0) {
                        if (parseInt(strValue) >= parseInt(this.masteryScore)) { this.LMSSetValue("cmi.core.lesson_status", "passed"); }
                        else { this.LMSSetValue("cmi.core.lesson_status", "failed"); }
                    }
                }
                else {
                    var strLessonMode = this.LMSGetValue("cmi.core.lesson_mode")
                    if (strLessonMode == "browse")
                        this.LMSSetValue("cmi.core.lesson_status", "browsed");
                }
            }
            this.strErrorID = "0";
            return "true";
        } else { return "false"; }
    } catch (ex) { this.strErrorID = "101"; return "false"; }
}


function LMSCommit(strEmpty) {
    try {        
        
        if (strEmpty.length != 0) { this.strErrorID = "201"; return "false"; }
        if (!this.blnInitialized) { this.strErrorID = "301"; return "false"; }
        this.LMSCommitToDB(); return "true";
    } catch (ex) { }
}


function LMSGetLastError() { return this.strErrorID; }


function LMSGetErrorString(strErrorNumber) {
    try {        
        if (strErrorNumber.length == 0) { return ""; }
        var objSearchNode = selectSingleNode(this.objXMLDataModelErrors.getElementsByTagName("LMSError"), "ID", strErrorNumber);
        return objSearchNode.text;
    } catch (ex) { }
}



function LMSGetDiagnostic(strErrorNumber) {
    try {
        if (strErrorNumber.length == 0) { strErrorNumber = this.strErrorID; }
        var objSearchNode = selectSingleNode(this.objXMLDataModelErrors.getElementsByTagName("LMSError"), "ID", strErrorNumber);
        return objSearchNode.text;
    } catch (ex) { }
}


function LMSFinish(strEmpty) {

    try {        
        if (strEmpty.length != 0) { this.strErrorID = "201"; return "false"; }
        if (this.blnInitialized) {
            this.LmsInitailzeStatus = "false";
            this.LmsFinishStatus = "true";
            this.setInitialData("cmi.core.lesson_status");
            this.LMSCommitToDB();
            objSearchNode = selectSingleNode(this.objXMLElementValuesDB.getElementsByTagName("SCO"), "Id", this.strSCOClicked);
            if (objSearchNode == null) {
                this.objXMLElementValuesDB.documentElement.appendChild(this.objXMLElementValues.documentElement);
            }
            else {
                var objSearchNewNode = this.objXMLElementValues.documentElement;
                //this.objXMLElementValuesDB.documentElement.replaceChild(objSearchNewNode, objSearchNode);
            }
            this.objXMLElementValues = null;
            this.blnInitialized = false;
            return "true";
        }
        else { this.strErrorID = "301"; return "false"; }
    } catch (ex) { }
}


function LoadXML(strXML) {
    try {        
        var RetXML = '';
        if (("string" != typeof (strXML)) || ("" == strXML)) { return null; }
        //        var RetXML = new ActiveXObject("Msxml2.DOMDocument.3.0");
        //        RetXML.async = false;
        //        RetXML.loadXML(strXML);
        try {
            RetXML = new ActiveXObject("Microsoft.XMLDOM");
            RetXML.async = "false";
            RetXML.loadXML(strXML);
        }
        catch (e) {
            if (window.DOMParser) {
                parser = new DOMParser();
                RetXML = parser.parseFromString(strXML, "text/xml"); //[user] where userType = 10
            }
        }


        try {
            if (0 != RetXML.parseError.errorCode) { return null; }
        }
        catch (e) {
            if (window.DOMParser) {
                if (RetXML.documentElement != null) {
                    if (RetXML.documentElement.nodeName == "parsererror") {
                        alert(RetXML.documentElement.childNodes[0].nodeValue);
                        return null;
                    }
                }
            }
        }
        return RetXML;
    } catch (e) { this.strErrorID = "101"; return null; }
}


function LoadXMLFile(strFile) {
    try {
        if (("string" != typeof (strFile)) || ("" == strFile)) { return null; }
        var oXML = "";
        oXML = new ActiveXObject("Msxml2.DOMDocument.3.0");
        oXML.async = false;
        oXML.load(strFile);
        if (0 != oXML.parseError.errorCode) { return null; }
        return oXML;
    }
    catch (e) { this.strErrorID = "101"; return null; }
}

function LMSGetValueValidations(strElementName) {
    try {
        if (this.objXMLDataModel == null) {
            this.objXMLDataModel = XmlHttp.create();
            this.objXMLDataModel.open("GET", requestPath + "/Scripts/LMSDataModel.xml", false);
            this.objXMLDataModel.send(null);
            this.objXMLDataModel = this.objXMLDataModel.responseXML;

     
        }
        var objSearchNode = selectSingleNode(this.objXMLDataModel.getElementsByTagName("DataElement"), "Name", strElementName);
        if (null == objSearchNode) { this.strErrorID = "401"; return false; }

        var strAccessibility = objSearchNode.attributes.getNamedItem("Accessibility").value;
        if (strAccessibility == "WriteOnly") { this.strErrorID = "404"; return false; }
        return true;
    }
    catch (ex) { this.strErrorID = "101"; return false; }
}

function LMSSetValueValidations(strFormattedElementName, strSetValue, strElementName) {
    try {
        var objSearchNode = selectSingleNode(this.objXMLDataModel.getElementsByTagName("DataElement"), "Name", strFormattedElementName);
        if (null == objSearchNode) { this.strErrorID = "401"; return false; }
        var strIsKeyWord = objSearchNode.attributes.getNamedItem("IsKeyWord").value;
        if (strIsKeyWord == "True") { this.strErrorID = "402"; return false; }
        var strAccessibility = objSearchNode.attributes.getNamedItem("Accessibility").value;
        if (strAccessibility == "ReadOnly")
        { this.strErrorID = "403"; return false; }
        //check for datatype
        var strDataType = objSearchNode.attributes.getNamedItem("DataType").value;
        //check whether the data is within the vocabulary supported
        if (strDataType == "CMIVocabulary") {
            if (strElementName.indexOf('credit') > 0) {
                if (!this.ValidateData('CMIVocabularyCredit', strSetValue, strElementName)) { this.strErrorID = "405"; return false; }
            }
            else if (strElementName.indexOf('lesson_status') > 0 || strElementName.indexOf('status') > 0) {
                if (!this.ValidateData('CMIVocabularyStatus', strSetValue, strElementName)) { this.strErrorID = "405"; return false; }
            }
            else if (strElementName.indexOf('entry') > 0) {
                if (!this.ValidateData('CMIVocabularyEntry', strSetValue, strElementName)) { this.strErrorID = "405"; return false; }
            }
            else if (strElementName.indexOf('lesson_mode') > 0) {
                if (!this.ValidateData('CMIVocabularyMode', strSetValue, strElementName)) { this.strErrorID = "405"; return false; }
            }
            else if (strElementName.indexOf('exit') > 0) {
                if (!this.ValidateData('CMIVocabularyExit', strSetValue, strElementName)) { this.strErrorID = "405"; return false; }
            }
            else if (strElementName.indexOf('time_limit_action') > 0) {
                if (!this.ValidateData('CMIVocabularyTimeLimitAction', strSetValue, strElementName)) { this.strErrorID = "405"; return false; }
            }
            else if (strElementName.indexOf('interactions') > 0 && strElementName.indexOf('type') > 0) {
                if (!this.ValidateData('CMIVocabularyInteraction', strSetValue, strElementName)) { this.strErrorID = "405"; return false; }
            }
            else if (strElementName.indexOf('result') > 0) {
                if (!this.ValidateData('CMIVocabularyResult', strSetValue, strElementName)) { this.strErrorID = "405"; return false; }
            }
        }
        else if (strDataType == "CMIFeedBack") {
            var strSearchElement = "cmi.interactions." + getN(strElementName) + ".type";
            var objSearchParentDataNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strSearchElement);
            if (objSearchParentDataNode != null) {
                if (!this.ValidateData(objSearchParentDataNode.attributes.getNamedItem("Value").value, strSetValue, strElementName)) { this.strErrorID = "405"; return false; }
            }
            else { this.strErrorID = "201"; return false; }
        }
        else {
            if (!this.ValidateData(strDataType, strSetValue, strElementName)) { this.strErrorID = "405"; return false; }
        }
        return true;
    }
    catch (ex) { this.strErrorID = "101"; return false; }
}

function FindScopeReturn(strFormattedElementName, strElementName) {
    try {        
        var objSearchNode = selectSingleNode(this.objXMLDataModel.getElementsByTagName("DataElement"), "Name", strFormattedElementName);
        var strScope = objSearchNode.attributes.getNamedItem("Scope").value;
        if (strScope == "Global") { this.strErrorID = "0"; return objSearchNode.attributes.getNamedItem("Value").value; }
        else {
            //the element has not been set of any value
            //create the element, set it to default and append it to xml
            var strDefaultValue = objSearchNode.attributes.getNamedItem("DefaultValue").value;
            var objNewXmlNode = this.objXMLElementValues.createElement("DataElement");
            var objNewAttribute = this.objXMLElementValues.createAttribute("Name");
            objNewAttribute.value = strElementName;
            objNewXmlNode.setAttributeNode(objNewAttribute);
            objNewAttribute = this.objXMLElementValues.createAttribute("Value");
            objNewAttribute.value = strDefaultValue;
            objNewXmlNode.setAttributeNode(objNewAttribute);
            this.objXMLElementValues.documentElement.appendChild(objNewXmlNode);
            this.strErrorID = "0";
            return strDefaultValue;
        }
    } catch (ex) { this.strErrorID = "101"; return ""; }
}

function ValidateData(strDataType, strData, strElementName) {
    try {
        switch (strDataType) {
            case "CMIString255":
                if (typeof (strData) == "string" || !isNaN(strData)) { if (strData.length <= 255) { return true; } else { this.strErrorID = "405"; return false; } }
                else { this.strErrorID = "405"; return false; }
            case "CMIString4096":
                if (typeof (strData) == "string" || !isNaN(strData)) { if (strData.length <= 4096) { return true; } else { this.strErrorID = "405"; return false; } }
                else { this.strErrorID = "405"; return false; }
            case "CMIDecimal/CMIBlank":
                if (typeof (strData) == "string" || !isNaN(strData) == false) {
                    if (strData.indexOf("-") >= 0 || strData.indexOf("+") >= 0) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return false;
                }
            case "CMIDecimal":
                if (isNaN(strData)) {
                    return false;
                }
                else {
                    return true;
                }
            case "CMIInteger":
                if (isNaN(strData) == false && strData.indexOf(".") == -1) { return true; } else { return false; }
            case "CMISInteger":
                if (isNaN(strData)) {
                    return false;
                }
                else {
                    var num = parseInt(strData);
                    if (num >= -32768 && num <= 32768) {
                        if (strElementName == "cmi.student_preference.audio") {
                            if (num < -1 || num > 100) {
                                this.strErrorID = "405";
                                return false;
                            }
                            else {
                                this.strErrorID = "0";
                                return true;
                            }
                        }
                        else if (strElementName == "cmi.student_preference.speed") {
                            if (num < -100 || num > 100) {
                                this.strErrorID = "405";
                                return false;
                            }
                            else {
                                this.strErrorID = "0";
                                return true;
                            }
                        }
                        else if (strElementName == "cmi.student_preference.text") {
                            if (num < -1 || num > 1) {
                                this.strErrorID = "405";
                                return false;
                            }
                            else {
                                this.strErrorID = "0";
                                return true;
                            }
                        }
                        else {
                            this.strErrorID = "0";
                            return true;
                        }
                    }
                    else {
                        this.strErrorID = "405";
                        return false;
                    }
                }
            case "CMITimeSpan":
                // must have some colons...
                if (strData.indexOf(":") == -1) {
                    return false;
                }
                // must contain at least 2 colons, giving 3 array elements...
                var cmiArray = strData.split(":");
                if (cmiArray.length < 3) {
                    return false;
                }
                // hours must be 4,3 or 2 digits...
                if (cmiArray[0].length < 2 || cmiArray[0].length > 4) {
                    return false;
                }
                // minutes must be 2 digits...
                if (cmiArray[1].length != 2) {
                    return false;
                }
                // must be numbers...
                if (isNaN(cmiArray[0]) || isNaN(cmiArray[1]) || isNaN(cmiArray[2])) {
                    return false;
                }
                // 24hr clock for hours...
                if (parseInt(cmiArray[0]) < 0) {
                    return false;
                }
                // parse minutes
                // NOTE: Seems illegal to have 99 minutes, but ADL 1.2
                // SCORM Conformance Test Suite does this? I'll do the same...
                // if (parseInt(cmiArray[1]) < 0 || parseInt(cmiArray[1]) > 59){
                if (parseInt(cmiArray[1]) < 0) {
                    return false;
                }
                // check for decimal place...
                if (cmiArray[2].indexOf(".") != -1) {
                    var cmiDecArray = cmiArray[2].split(".");
                    // can only be 2 values here...
                    if (cmiDecArray.length != 2) {
                        return false;
                    }
                    // again they must be numbers...
                    if (isNaN(cmiDecArray[0]) || isNaN(cmiDecArray[1])) {
                        return false;
                    }
                    // only two digits allowed for seconds...
                    if (cmiDecArray[0].length != 2) {
                        return false;
                    }
                    // make sure there is less than 60 seconds here...
                    if (parseInt(cmiDecArray[0]) > 59) {
                        return false;
                    }
                    // only one or two digits allowed for milliseconds...
                    if (cmiDecArray[1].length > 2) {
                        return false;
                    }
                }
                else {
                    // no dots, so must be no milliseconds...
                    // make sure length is 2
                    if (cmiArray[2].length != 2) {
                        return false;
                    }
                    // make sure there is less than 60 seconds here...
                    if (parseInt(cmiArray[2]) > 59) {
                        return false;
                    }
                }
                // got up to here, then value okay...
                return true;
            case "CMITime":
                // must have some colons...                
                if (strData.indexOf(":") == -1) {
                    return false;
                }
                // must contain at least 2 colons, giving 3 array elements...
                var cmiArray = strData.split(":");
                if (cmiArray.length < 3) {
                    return false;
                }
                // hours & minutes must be 2 digits...
                if (cmiArray[0].length != 2 || cmiArray[1].length != 2) {
                    return false;
                }
                // must be numbers...
                if (isNaN(cmiArray[0]) || isNaN(cmiArray[1]) || isNaN(cmiArray[2])) {
                    return false;
                }
                // 24hr clock for hours...
                if (parseInt(cmiArray[0]) < 0 || parseInt(cmiArray[0]) > 23) {
                    return false;
                }
                // parse minutes
                if (parseInt(cmiArray[1]) < 0 || parseInt(cmiArray[1]) > 59) {
                    return false;
                }
                // check for decimal place...
                if (cmiArray[2].indexOf(".") != -1) {
                    var cmiDecArray = cmiArray[2].split(".");
                    // can only be 2 values here...
                    if (cmiDecArray.length != 2) {
                        return false;
                    }
                    // again they must be numbers...
                    if (isNaN(cmiDecArray[0]) || isNaN(cmiDecArray[1])) {
                        return false;
                    }
                    // only two digits allowed for seconds...
                    if (cmiDecArray[0].length != 2) {
                        return false;
                    }
                    // make sure there is less than 60 seconds here...
                    if (parseInt(cmiDecArray[0]) > 59) {
                        return false;
                    }
                    // only one or two digits allowed for milliseconds...
                    if (cmiDecArray[1].length > 2) {
                        return false;
                    }
                }
                else {
                    // no dots, so must be no milliseconds...
                    // make sure length is 2
                    if (cmiArray[2].length != 2) {
                        return false;
                    }
                    // make sure there is less than 60 seconds here...
                    if (parseInt(cmiArray[2]) > 59) {
                        return false;
                    }
                }
                // got up to here, then value okay...
                return true;
            case "true-false":
                if (strData.charAt(0) == "t" || strData.charAt(0) == "f" || strData.charAt(0) == "0" || strData.charAt(0) == "1") { return true; } else { return false; }
            case "choice":
                var strChars = new Array();
                strChars = strData.split(",");
                for (var i = 0; i < strChars.length; i++) {
                    if (strChars[i].length == 1) { continue; } else { return false; }
                }
                return true;
            case "numeric":
                if (isNaN(strData)) { return false; } else { return true; }
            case "matching":
                var strElements = new Array();
                strElements = strData.split(".");
                if (strElements.length == 2) { return true; } else { return false; }
            case "performance":
                if (strData.length > 255) { return false; } else { return true; }
            case "CMIIdentifier": { return checkCMIIdentifier(strData); break }
            case "CMIVocabularyCredit": { return checkCMIVocabularyCredit(strData); break }
            case "CMIVocabularyStatus": { return checkCMIVocabularyStatus(strElementName, strData); break }
            case "CMIVocabularyEntry": { return checkCMIVocabularyEntry(strData); break }
            case "CMIVocabularyMode": { return checkCMIVocabularyMode(strData); break }
            case "CMIVocabularyExit": { return checkCMIVocabularyExit(strData); break }
            case "CMIVocabularyTimeLimitAction": { return checkCMIVocabularyTimeLimitAction(strData); break }
            case "CMIVocabularyInteraction": { return checkCMIVocabularyInteraction(strData); break }
            case "CMIVocabularyResult": { return checkCMIVocabularyResult(strData); break }
            default:
                return true;
        }
    } catch (ex) { this.strErrorID = "101"; return false; }
}
function checkCMIIdentifier(value) {
    var SPACE = ' ';
    var TAB = '\t';
    var CRETURN = '\r';
    var LINEFEED = '\n';
    if (value.indexOf(SPACE) == -1 && value.indexOf(TAB) == -1 && value.indexOf(CRETURN) == -1 && value.indexOf(LINEFEED) == -1) {
        if (value.length > 0 && value.length < 256) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
function checkCMIDecimal(value) {
    if (isNaN(value)) {
        return false;
    }
    else {
        return true;
    }
}

function checkCMIVocabularyResult(value) {
    var ans = checkCMIDecimal(value);
    if (ans) {
        return true;
    }
    if (value == "correct" || value == "wrong" ||
        value == "unanticipated" || value == "neutral") {
        return true;
    }
    else {
        return false;
    }
}


function checkCMIVocabularyInteraction(value) {
    if (value == "true-false" || value == "choice" ||
        value == "fill-in" || value == "matching" ||
        value == "performance" || value == "likert" ||
        value == "sequencing" || value == "numeric") {
        return true;
    }
    else {
        return false;
    }
}

function checkCMIVocabularyTimeLimitAction(value) {
    if (value == "exit,message" || value == "exit,no message" ||
        value == "continue,message" || value == "continue,no message") {
        return true;
    }
    else {
        return false;
    }
}

function checkCMIVocabularyExit(value) {
    if (value == "time-out" || value == "suspend" ||
        value == "logout" || value == "") {
        return true;
    }
    else {
        return false;
    }
}

function checkCMIVocabularyMode(value) {
    if (value == "normal" || value == "review" || value == "browse") {
        return true;
    }
    else {
        return false;
    }
}

function checkCMIVocabularyEntry(value) {
    if (value == "ab-initio" || value == "resume" || value == "") {
        return true;
    }
    else {
        return false;
    }
}

function checkCMIVocabularyStatus(element, value) {
    // sco cannot set lesson_status to not attempted
    if (element == "cmi.core.lesson_status" && value == "not attempted") {
        return false;
    }
    if (value == "passed" || value == "completed" ||
        value == "failed" || value == "incomplete" ||
        value == "browsed" || value == "not attempted") {
        return true;
    }
    else {
        return false;
    }
}

function checkCMIVocabularyCredit(value) {
    if (value == "credit" || value == "no-credit") {
        return true;
    }
    else {
        return false;
    }
}


//****************************************************************************************
// Modified by        : Ganesh.N
// Name		          :	setInitialData
// Purpose            :	(non SCORM Function)on lmsinitialize to check various conditions and set the values accordingly
// Inputs	          : 
// Created Date 	  : 10th June 2007
// Modified Date      : 27th August 2007
// Returns            :	
//*****************************************************************************************	
function setInitialData(strElementName) {
    try {        
        var strPrevValue, objDependentNode, strDependentElementName, objSearchNode;
        //setting initial value for cmi.core.lesson_status
        //before setting the initial values u can also validate the value to be set 
        //by calling LMSSetValueValidations
        switch (strElementName) {
            case "cmi.core.lesson_status":
                objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strElementName);
                if (objSearchNode == null) {
                    var objNewXmlNode = this.objXMLElementValues.createElement("DataElement");
                    var objNewAttribute = this.objXMLElementValues.createAttribute("Name");
                    objNewAttribute.value = strElementName;
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    objNewAttribute = this.objXMLElementValues.createAttribute("Value");
                    objNewAttribute.value = "not attempted";
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    this.objXMLElementValues.documentElement.appendChild(objNewXmlNode);
                    return;
                }
                else {
                    strPrevValue = objSearchNode.attributes.getNamedItem("Value").value;
                    if (strPrevValue == "not attempted") { objSearchNode.attributes.getNamedItem("Value").value = "incomplete"; return; }
                    return;
                }
                //setting initial value for cmi.core.entry
                //dependent on lesson_status and score.raw
            case "cmi.core.student_id":
                objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strElementName);
                if (objSearchNode == null) {
                    var objNewXmlNode = this.objXMLElementValues.createElement("DataElement");
                    var objNewAttribute = this.objXMLElementValues.createAttribute("Name");
                    objNewAttribute.value = strElementName;
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    objNewAttribute = this.objXMLElementValues.createAttribute("Value");
                    objNewAttribute.value = CoursePreferences.UserId;
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    this.objXMLElementValues.documentElement.appendChild(objNewXmlNode);
                    return;
                }
                break;
            case "cmi.core.student_name":
                objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strElementName);
                if (objSearchNode == null) {
                    var objNewXmlNode = this.objXMLElementValues.createElement("DataElement");
                    var objNewAttribute = this.objXMLElementValues.createAttribute("Name");
                    objNewAttribute.value = strElementName;
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    objNewAttribute = this.objXMLElementValues.createAttribute("Value");
                    objNewAttribute.value = CoursePreferences.LastName + "," + CoursePreferences.FirstName;
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    this.objXMLElementValues.documentElement.appendChild(objNewXmlNode);
                    return;
                }
                break;
            case "cmi.core.entry":
                objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strElementName);
                if (objSearchNode == null) {
                    var objNewXmlNode = this.objXMLElementValues.createElement("DataElement");
                    var objNewAttribute = this.objXMLElementValues.createAttribute("Name");
                    objNewAttribute.value = strElementName;
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    objNewAttribute = this.objXMLElementValues.createAttribute("Value");
                    objNewAttribute.value = "ab-initio";
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    this.objXMLElementValues.documentElement.appendChild(objNewXmlNode);
                    return;
                }
                else {
                    var strPrevValue = objSearchNode.attributes.getNamedItem("Value").value;
                    if (strPrevValue == "ab-initio") { objSearchNode.attributes.getNamedItem("Value").value = "resume"; }

                    strDependentElementName = "cmi.core.lesson_status";
                    objDependentNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strDependentElementName);
                    if (objDependentNode != null) {
                        strPrevValue = objDependentNode.attributes.getNamedItem("Value").value;
                        if (strPrevValue == "passed" || strPrevValue == "completed" || strPrevValue == "failed") { objSearchNode.attributes.getNamedItem("Value").value = ""; return; }
                    }
                    strDependentElementName = "cmi.core.score.raw";
                    objDependentNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strDependentElementName);
                    if (objDependentNode != null) {
                        strPrevValue = objDependentNode.attributes.getNamedItem("Value").value;
                        if (parseInt(strPrevValue) >= 0) { objSearchNode.attributes.getNamedItem("Value").value = ""; return; }
                    }
                    strDependentElementName = "cmi.core.exit";
                    objDependentNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strDependentElementName);
                    if (objDependentNode != null) {
                        strPrevValue = objDependentNode.attributes.getNamedItem("Value").value;
                        if (strPrevValue == "suspend") { objSearchNode.attributes.getNamedItem("Value").value = "resume"; return; }
                        else { objSearchNode.attributes.getNamedItem("Value").value = ""; return; }
                    }
                    return;
                }
        }
    } catch (ex) { this.strErrorID = "101"; }
}

function internalLMSSetValue(strElementName, strData) {
    try {        
        var objSearchNode = selectSingleNode(this.objXMLDataModel.getElementsByTagName("DataElement"), "Name", strElementName);
        if (objSearchNode == null) {
            var objSearchDataElement = selectSingleNode(this.objXMLDataModel.getElementsByTagName("DataElement"), "Name", formatnTypeElement(strElementName));
            var strDataType = objSearchDataElement.attributes.getNamedItem("DataType").value;
            if (strDataType == "CMIVocabulary") {
                var objNextSibling = objSearchDataElement.firstChild;
                while (objNextSibling != null) {
                    if (objNextSibling.text == strData) {
                        var objNewXmlNode = this.objXMLElementValues.createElement("DataElement");
                        var objNewAttribute = this.objXMLElementValues.createAttribute("Name");
                        objNewAttribute.value = strElementName;
                        objNewXmlNode.setAttributeNode(objNewAttribute);
                        objNewAttribute = this.objXMLElementValues.createAttribute("Value");
                        objNewAttribute.value = strData;
                        objNewXmlNode.setAttributeNode(objNewAttribute);
                        this.objXMLElementValues.documentElement.appendChild(objNewXmlNode);
                        return;
                    }
                    objNextSibling = objNextSibling.nextSibling;
                }
                return;
            }
            else {
                if (this.ValidateData(strDataType, strData, strElementName)) {
                    var objNewXmlNode = this.objXMLElementValues.createElement("DataElement");
                    var objNewAttribute = this.objXMLElementValues.createAttribute("Name");
                    objNewAttribute.value = strElementName;
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    objNewAttribute = this.objXMLElementValues.createAttribute("Value");
                    objNewAttribute.value = strData;
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    this.objXMLElementValues.documentElement.appendChild(objNewXmlNode);
                } else { this.strErrorID = "0"; }
            }
        }
        return;
    } catch (ex) { }
}

function formatnTypeElement(strElementName) {
    try {        
        if (strElementName.indexOf("cmi.objectives") >= 0 || strElementName.indexOf("cmi.interactions") >= 0) {
            var arrSubElementName = new Array();
            arrSubElementName = strElementName.split(".");
            for (var i = 0; i < arrSubElementName.length; i++) {
                if (isNaN(arrSubElementName[i])) { continue; } else { arrSubElementName[i] = "n"; }
            }
            if (strElementName.indexOf(".n.") >= 0) { return false; } else { return (arrSubElementName.join(".")); }
        } else { return strElementName; }
    } catch (ex) { }
}

function getN(strElementName) {
    try {
        var arrSubElementName = new Array();
        arrSubElementName = strElementName.split(".");
        for (var i = 0; i < arrSubElementName.length; i++) {
            if (isNaN(arrSubElementName[i])) { continue; } else { return arrSubElementName[i]; }
        }
        return (-1);
    } catch (ex) { }
}

function validateIndex(strElementName, strFromFunctionName) {
    try {
        var arrSubElementName = new Array();
        var objSearchNode;
        arrSubElementName = strElementName.split(".");
        var strSearchElementName;
        var strSearchChildElementName = null;
        var blnChngMade = false;
        var blnInsideLoop = false;
        if (strElementName.indexOf("cmi.objectives") >= 0) { strSearchElementName = "cmi.objectives._count"; }
        else if (strElementName.indexOf("cmi.interactions") >= 0) {
            strSearchElementName = "cmi.interactions._count";
            if (strElementName.indexOf("objectives") >= 0) { strSearchChildElementName = strCountFind(strElementName); }
            else if (strElementName.indexOf("correct_responses") >= 0) { strSearchChildElementName = strCountFind(strElementName); }
        }

        for (var i = 0; i < arrSubElementName.length; i++) {
            if (isNaN(arrSubElementName[i])) { continue; }
            else {
                if (blnInsideLoop == false) {
                    objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strSearchElementName);
                }
                else {
                    objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strSearchChildElementName);
                }

                if (objSearchNode == null) {
                    if (arrSubElementName[i] == "0" || arrSubElementName[i] == "1" || arrSubElementName[i] == "2" || arrSubElementName[i] == "3" || arrSubElementName[i] == "4" || arrSubElementName[i] == "5" || arrSubElementName[i] == "6" || arrSubElementName[i] == "7" || arrSubElementName[i] == "8" || arrSubElementName[i] == "9" || arrSubElementName[i] == "10" || arrSubElementName[i] == "11" || arrSubElementName[i] == "12" || arrSubElementName[i] == "13" || arrSubElementName[i] == "14" || arrSubElementName[i] == "15" || arrSubElementName[i] == "16" || arrSubElementName[i] == "17" || arrSubElementName[i] == "18" || arrSubElementName[i] == "19" || arrSubElementName[i] == "20" || arrSubElementName[i] == "21" || arrSubElementName[i] == "22" || arrSubElementName[i] == "23" || arrSubElementName[i] == "24" || arrSubElementName[i] == "25") {
                        if (strFromFunctionName == "LMSSetValue") {
                            if (blnInsideLoop == false) { this.internalLMSSetValue(strSearchElementName, "1"); blnChngMade = true; }
                            else { this.internalLMSSetValue(strSearchChildElementName, "1"); }
                        }
                        if (strSearchChildElementName == null) { return true; }
                    }
                    else {
                        if (blnChngMade == true) {
                            objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strSearchElementName);
                            objSearchNode.attributes.getNamedItem("Value").value = parseInt(objSearchNode.attributes.getNamedItem("Value").value) - 1;
                        }
                        return false;
                    }
                }
                else {
                    if (parseInt(arrSubElementName[i]) <= parseInt(objSearchNode.attributes.getNamedItem("Value").value)) {
                        if (strFromFunctionName == "LMSSetValue" && arrSubElementName[i] == parseInt(objSearchNode.attributes.getNamedItem("Value").value)) {
                            objSearchNode.attributes.getNamedItem("Value").value = parseInt(objSearchNode.attributes.getNamedItem("Value").value) + 1;
                            blnChngMade = true;
                        }
                        if (strSearchChildElementName == null) { return true; }
                    }
                    else {
                        if (blnChngMade == true) {
                            objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strSearchElementName);
                            objSearchNode.attributes.getNamedItem("Value").value = parseInt(objSearchNode.attributes.getNamedItem("Value").value) - 1;
                        }
                        return false;
                    }
                }
                blnInsideLoop = true;
            }
        }
        if (blnInsideLoop == true) { return true; } else { return false; }
    } catch (ex) { }
}

function strCountFind(strElementName) {
    try {
        var strArr = new Array();
        var strReturnValue = "";
        strArr = strElementName.split(".");
        for (var i = 0; i < strArr.length; i++) {
            if (strArr[i] == "objectives" || strArr[i] == "correct_responses") {
                strReturnValue = strReturnValue + strArr[i] + "." + "_count"; return strReturnValue;
            }
            else { strReturnValue = strReturnValue + strArr[i] + "."; }
        } return strReturnValue;
    } catch (ex) { }
}

function isSameParent(strDuplicateName, strElementName) {
    var arrDuplicateName = new Array();
    arrDuplicateName = strDuplicateName.split(".");
    var arrElementName = new Array();
    arrElementName = strElementName.split(".");
    if (arrDuplicateName.length != arrElementName.length) { return false; }

    for (var i = 0; i < arrElementName.length; i++) {
        if (isNaN(arrElementName[i])) {
            if (arrElementName[i] == arrDuplicateName[i]) { continue; } else { return false; }
        }
        else {
            if (arrElementName[i] == arrDuplicateName[i]) {
                if ((strElementName.indexOf("cmi.interactions") >= 0) && ((strElementName.indexOf("objectives") >= 0) || (strElementName.indexOf("correct_responses") >= 0))) {
                    return true;
                } else { return false; }
            }
            else {
                if ((strElementName.indexOf("cmi.interactions") >= 0) && ((strElementName.indexOf("objectives") >= 0) || (strElementName.indexOf("correct_responses") >= 0))) { return false; }
            }
        }
    }
    return true;
}

function loadDataFromManifest(strDataElement, strValue, strSCOClicked) {
    var objSearchNode = selectSingleNode(this.objXMLElementValuesDB.getElementsByTagName("SCO"), "Id", strSCOClicked);
    objSearchNode = selectSingleNode(this.objXMLElementValuesDB.getElementsByTagName("DataElement"), "Name", strDataElement);
    if (objSearchNode != null) { return; }

    objSearchNode = selectSingleNode(this.objXMLElementValuesDB.getElementsByTagName("DataElement"), "Id", strSCOClicked);
    if (objSearchNode == null) {
        var objNewXmlNode = this.objXMLElementValuesDB.createElement("SCO");
        var objNewAttribute = this.objXMLElementValuesDB.createAttribute("Id");
        objNewAttribute.value = strSCOClicked;
        objNewXmlNode.setAttributeNode(objNewAttribute);
        this.objXMLElementValuesDB.documentElement.appendChild(objNewXmlNode);
        objSearchNode = selectSingleNode(this.objXMLElementValuesDB.getElementsByTagName("SCO"), "Id", strSCOClicked);
    }
    var strReturnObj = this.internalLMSSetValueVer1(strDataElement, strValue, objSearchNode);
    if (strReturnObj) { objSearchNode.appendChild(strReturnObj); }
    else { alert("data from manifest validated to false"); }
}

function internalLMSSetValueVer1(strElementName, strData, objXML) {
    try {
        var objSearchNode = selectSingleNode(objXML.getElementsByTagName("DataElement"), "Name", strElementName);
        if (objSearchNode == null) {
            var objSearchDataElement = selectSingleNode(this.objXMLDataModel.getElementsByTagName("DataElement"), "Name", formatnTypeElement(strElementName));
            var strDataType = objSearchDataElement.attributes.getNamedItem("DataType").value;
            if (strDataType == "CMIVocabulary") {
                var objNextSibling = objSearchDataElement.firstChild;
                while (objNextSibling != null) {
                    if (objNextSibling.text == strData) {
                        var objNewXmlNode = objXML.createElement("DataElement");
                        var objNewAttribute = objXML.createAttribute("Name");
                        objNewAttribute.value = strElementName;
                        objNewXmlNode.setAttributeNode(objNewAttribute);
                        objNewAttribute = this.objXMLElementValues.createAttribute("Value");
                        objNewAttribute.value = strData;
                        objNewXmlNode.setAttributeNode(objNewAttribute);
                        return objNewXmlNode;
                    }
                    objNextSibling = objNextSibling.nextSibling;
                }
                return false;
            }
            else {
                if (this.ValidateData(strDataType, strData, strElementName)) {
                    var objNewXmlNode = this.objXMLElementValuesDB.createElement("DataElement");
                    var objNewAttribute = this.objXMLElementValuesDB.createAttribute("Name");
                    objNewAttribute.value = strElementName;
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    objNewAttribute = this.objXMLElementValuesDB.createAttribute("Value");
                    objNewAttribute.value = strData;
                    objNewXmlNode.setAttributeNode(objNewAttribute);
                    objXML.appendChild(objNewXmlNode);
                    return objNewXmlNode;
                } else { this.strErrorID = "0"; return false; }
            }
        } return false;
    } catch (ex) { }
}

//****************************************************************************************
// Modified by        : Ganesh.N
// Name		          :	LMSCommitToDB
// Purpose            :	on unload of sco it is called to write to the DB
// Inputs	          : 
// Created Date 	  : 10th June 2007
// Modified Date      : 27th August 2007
// Returns            :	
//*****************************************************************************************
// function LMSCommitToDB() {    
    // if (CoursePreferences.Tracking.TrackingEnabled) {
        // if (this.objXMLElementValues != null) {
            // try {            
                // var strPatternToRemove = '<?xml version=\"1.0\"?>';
                // var objNewxmlDoc = XmlDocument.create();
                // //this.objXMLElementValues = (this.objXMLElementValuesDB != null) ? this.objXMLElementValuesDB : this.objXMLElementValues;
                // objNewxmlDoc.loadXML("<DataElements>" + ((NodeDetails[currentNodeId].iscompleted == "True") ? this.objXMLElementValues.xml.toString().replace("incomplete", 'completed').replace(strPatternToRemove, '') : this.objXMLElementValues.xml.toString().replace(strPatternToRemove, '')) + "</DataElements>");

                // if (objNewxmlDoc != null && objNewxmlDoc.xml != null) {
                    // var myJson = { strXML: objNewxmlDoc.xml, userId: CoursePreferences.UserId, courseId: CoursePreferences.CourseId, packageAssetId: CoursePreferences.PackageAssetId, scheduleId: CoursePreferences.scheduleId };
                    // var message = JSON.stringify(myJson, function (key, value) { return value; });
                    // var response = $.ajax({
                        // type: "POST",
                        // data: message,
                        // async: false,
                        // contentType: "application/json; charset=utf-8",
                        // dataType: "json",
                        // url: requestPath + "/AjaxMethods.aspx/SetBrowsedStatus",
                        // success: OnSuccessSetBrowsedStatus,
                        // error: OnFailed
                    // });
                    // this.LmsInitailzeStatus = "false";
                    // this.LmsFinishStatus = "false";
                    // if (selectSingleNode(objNewxmlDoc.getElementsByTagName("DataElement"), "Value", "completed") != null) { ChangeNodeStatus(this.strSCOClicked); }
                // }
            // } catch (ex) { } //alert("Exception in LMSCommitToDB"); }
        // }
    // }
// }

function LMSCommitToDB() {    
    if (CoursePreferences.Tracking.TrackingEnabled) {
        if (this.objXMLElementValues != null) {
            try {            
                var strPatternToRemove = '<?xml version=\"1.0\"?>';
                var objNewxmlDoc = XmlDocument.create();
                //this.objXMLElementValues = (this.objXMLElementValuesDB != null) ? this.objXMLElementValuesDB : this.objXMLElementValues;
                objNewxmlDoc.loadXML("<DataElements>" + ((NodeDetails[currentNodeId].iscompleted == "True") ? this.objXMLElementValues.xml.toString().replace("incomplete", 'completed').replace(strPatternToRemove, '') : this.objXMLElementValues.xml.toString().replace(strPatternToRemove, '')) + "</DataElements>");

                if (objNewxmlDoc != null && objNewxmlDoc.xml != null) {
                    var myJson = { strXML: objNewxmlDoc.xml, userId: CoursePreferences.UserId, courseId: CoursePreferences.CourseId, packageAssetId: CoursePreferences.PackageAssetId, scheduleId: CoursePreferences.scheduleId };
                    var message = JSON.stringify(myJson, function (key, value) { return value; });
                   // var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
				   //if(isChrome == true) {
				    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
					var isChromeNew = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
					isChromeNew=true;
					if(isChrome == true || isChromeNew == true) {
					
						var response = $.ajax({
							type: "POST",
							data: message,
							//async: false,
							contentType: "application/json; charset=utf-8",
							dataType: "json",
							url: requestPath + "/AjaxMethods.aspx/SetBrowsedStatus",
							success: function (response) {
								response = (response != null) ? response.d : response; if (response == "timeout") {
									alertandnavigate();
								}
							},
							error: function (xhr, status, error) {
								alertandnavigate();
							}
							//success: OnSuccessSetBrowsedStatus,
							//error: OnFailed
						});
					}
					else {
						var response = $.ajax({
							type: "POST",
							data: message,
							async: false,
							contentType: "application/json; charset=utf-8",
							dataType: "json",
							url: requestPath + "/AjaxMethods.aspx/SetBrowsedStatus",
							success: OnSuccessSetBrowsedStatus,
							error: OnFailed
						});
					}
                    this.LmsInitailzeStatus = "false";
                    this.LmsFinishStatus = "false";
                    if (selectSingleNode(objNewxmlDoc.getElementsByTagName("DataElement"), "Value", "completed") != null) { ChangeNodeStatus(this.strSCOClicked); }
                }
            } catch (ex) { } //alert("Exception in LMSCommitToDB"); }
        }
    }
}

function OnSuccessSetBrowsedStatus(response) {
    response = (response != null) ? response.d : response; if (response == "timeout") {
        alertandnavigate();
    }
}

function handleResult(res) { if (res.error) { alert("Unsuccessful call. Error is " + res.errorDetail.string); } };

//****************************************************************************************
// Modified by        : Ganesh.N
// Name		          :	LMSRetrieveFromDB
// Purpose            :	this function is called before the sco is launched to retrive the browsed status
// Inputs	          : 
// Created Date 	  : 10th June 2007
// Modified Date      : 27th August 2007
// Returns            :	
//*****************************************************************************************
function LMSRetrieveFromDB() {
    try {        
        var myJson = { userId: CoursePreferences.UserId, contentStructureAssetId: currentNodeId };
        var message = JSON.stringify(myJson, function (key, value) { return value; });
        var response = $.ajax({
            type: "POST",
            data: message,
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: requestPath + "/AjaxMethods.aspx/GetBrowsedStatus",
            success: SucceededCallback,
            error: OnFailed
        });
        //PageMethods.GetBrowsedStatus(CoursePreferences.Preferences.userid, currentNodeId, SucceededCallback, OnFailed);	
    } catch (ex) {
    }
}

//****************************************************************************************
// Modified by        : Ganesh.N
// Name		          :	SucceededCallback
// Purpose            :	this function is called on succeeded call back of the above function
// Inputs	          : 
// Created Date 	  : 10th June 2007
// Modified Date      : 27th August 2007
// Returns            :	
//*****************************************************************************************
function SucceededCallback(result) {
    result = (result != null) ? result.d : result;
    if (result == "timeout") {
        alertandnavigate();
        return;
    }
    return result;
}


//****************************************************************************************
// Modified by        : Ganesh.N
// Name		          :	OnFailed
// Purpose            :	this function is called on unsucceessful call back retrive function or commit to Db fuction
// Inputs	          : 
// Created Date 	  : 10th June 2007
// Modified Date      : 27th August 2007
// Returns            :	
//*****************************************************************************************
function OnFailed(error) { alertandnavigate(); }

function internalLMSGetValue(strSCOID, strDataElementName) {
    var objSearchNode;
    try {
        if (this.strSCOClicked == strSCOID) {
            objSearchNode = selectSingleNode(this.objXMLElementValues.getElementsByTagName("DataElement"), "Name", strDataElementName);
            if (objSearchNode != null) { return objSearchNode.getAttribute("Value"); }
        }
    } catch (ex) { }

    objSearchNode = selectSingleNode(this.objXMLElementValuesDB.getElementsByTagName("SCO"), "Id", strSCOID);
    objSearchNode = selectSingleNode(this.objXMLElementValuesDB.getElementsByTagName("DataElement"), "Name", strDataElementName);
    if (objSearchNode == null) { return ""; } else { return objSearchNode.getAttribute("Value"); }
}

/*******************************************************************************
Newly inserted code
*******************************************************************************/
function getDomDocumentPrefix() {
    if (getDomDocumentPrefix.prefix)
        return getDomDocumentPrefix.prefix;

    var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"]; var o;
    for (var i = 0; i < prefixes.length; i++) {
        try {
            o = new ActiveXObject(prefixes[i] + ".DomDocument");
            return getDomDocumentPrefix.prefix = prefixes[i];
        } catch (ex) { };
    }
    throw new Error("Could not find an installed XML parser");
}

function getXmlHttpPrefix() {
    if (getXmlHttpPrefix.prefix)
        return getXmlHttpPrefix.prefix;

    var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"]; var o;
    for (var i = 0; i < prefixes.length; i++) {
        try {
            o = new ActiveXObject(prefixes[i] + ".XmlHttp");
            return getXmlHttpPrefix.prefix = prefixes[i];
        } catch (ex) { };
    }
    throw new Error("Could not find an installed XML parser");
}

function XmlHttp() { }

XmlHttp.create = function () {
    try {
        if (window.XMLHttpRequest) {
            var req = new XMLHttpRequest();
            if (req.readyState == null) {
                req.readyState = 1;
                req.addEventListener("load", function () { req.readyState = 4; if (typeof req.onreadystatechange == "function") req.onreadystatechange(); }, false);
            }
            return req;
        }
        if (window.ActiveXObject) { return new ActiveXObject(getXmlHttpPrefix() + ".XmlHttp"); }
    }
    catch (ex) { }
    throw new Error("Your browser does not support XmlHttp objects");
};

function XmlDocument() { }
XmlDocument.create = function () {
    try {
        if (document.implementation && document.implementation.createDocument) {
            var doc = document.implementation.createDocument("", "", null);
            if (doc.readyState == null) {
                doc.readyState = 1;
                doc.addEventListener("load", function () {
                    doc.readyState = 4;
                    if (typeof doc.onreadystatechange == "function")
                        doc.onreadystatechange();
                }, false);
            }
            return doc;
        }
        if (window.ActiveXObject) { return new ActiveXObject(getDomDocumentPrefix() + ".DomDocument"); }
    } catch (ex) { }
    throw new Error("Your browser does not support XmlDocument objects");
};

if (window.DOMParser && window.XMLSerializer && window.Node && Node.prototype && Node.prototype.__defineGetter__) {
    Document.prototype.loadXML = function (s) {
        var doc2 = (new DOMParser()).parseFromString(s, "text/xml");
        while (this.hasChildNodes())
            this.removeChild(this.lastChild);
        for (var i = 0; i < doc2.childNodes.length; i++) {
            this.appendChild(this.importNode(doc2.childNodes[i], true));
        }
    };

    Document.prototype.__defineGetter__("xml", function () {
        return (new XMLSerializer()).serializeToString(this);
    });
}

function selectSingleNode(objNodeList, strAttributeName, strAttributeValue) {
    try {
        var strValuePresent;
        for (var i = 0; i < objNodeList.length; i++) {
            strValuePresent = undefined;
            strValuePresent = objNodeList[i].getAttribute(strAttributeName);
            if (strValuePresent == undefined || strValuePresent != strAttributeValue)
                continue;
            else
                return objNodeList[i];
        }
        return null;
    } catch (ex) { alert("exception in selectSingleNode"); return null; }
}

function dealWithSettingInteractions(element, value) {
    //  _CHILDREN ARE READONLY
    if (element == "cmi.interactions._children") {
        this.strErrorID = "402";
        return false;
    }
    //  _COUNT IS READ ONLY
    if (element == "cmi.interactions._count") {
        this.strErrorID = "402";
        return false;
    }

    // ELSE CHECK THAT THE ELEMENT IS VALID AND HAS AT LEAST 3 PARAMS, DOESNT HAVE
    // MORE THAN 6 PARAMS  - ALL ILLEGAL
    var cmiArray = element.split(".");
    if (cmiArray.length < 3 || cmiArray.length > 6) {
        this.strErrorID = "201";
        return false;
    }
    // IF 3RD ARG IS NOT A NUMBER THEN THROW ERROR
    // need to check cmiArray[2] to see if its a number
    if (isNaN(cmiArray[2])) {
        this.strErrorID = "401";
        return false;
    }

    var theCount = API.cmi.interactions._count.cmivalue;

    // IF ITS A NUMBER MAKE SURE ITS IN THE ARRAY BOUNDS
    if (cmiArray[2] > theCount || cmiArray[2] < 0) {
        // call to array is out of bounds
        this.strErrorID = "201";
        return false;
    }
    else if (cmiArray[2] <= theCount) {

        //create a new one or get existing object
        var existingObjectiveHandle = API.cmi.interactions.intArray(cmiArray[2]);
        if (existingObjectiveHandle == null) {
            this.strErrorID = "101";
            return false;
        }
        else {
            // we now have a reference to cmi.interactions.n
            // if theres 4 bits to the element path then try to see if object exists

            if (cmiArray.length == 4) {
                strleaf = "existingObjectiveHandle." + cmiArray[3];
                var doesLeafExist = eval(strleaf);
                if (doesLeafExist == null) {
                    this.strErrorID = "201";
                    return false;
                }
                else {

                    // NEXT CHECK THAT THIS ELEMENT IS NOT READONLY
                    strleafstatus = "doesLeafExist.cmireadStatus";
                    var leafstatus = eval(strleafstatus);
                    if (leafstatus == "readonly") {
                        this.strErrorID = "403";
                        return false;
                    }

                    // check the datatype and vocabulary...
                    var datatype = doesLeafExist.cmidatatype;
                    res = API.ServerSco.checkDataTypeAndVocab(element, value, datatype);
                    if (res == "true") {
                        // correct datatype...
                        // WE CAN NOW TRY TO SET THE FULL OBJECT REFERENCE
                        var strleafval = "doesLeafExist.cmivalue =\"" + value + "\";";
                        var leafVal = eval(strleafval);
                        if (leafVal == null) {
                            // IT FAILED AT THE FINAL HURDLE...
                            this.strErrorID = "201";
                            return false;
                        }
                        else {
                            this.strErrorID = "0";
                            return true;
                        }
                    }
                    else {
                        // incorrect data type...
                        this.strErrorID = "405";
                        return false;
                    }
                }
            }
            if (cmiArray.length == 5) {
                // check object exists
                strbranch = "existingObjectiveHandle." + cmiArray[3] + ";";
                var doesLeafExist = eval(strbranch);
                if (doesLeafExist == null) {
                    this.strErrorID = "201";
                    return false;
                }

                // check final object exists in the array list...
                nextstrbranch = "existingObjectiveHandle." + cmiArray[3] + "." + cmiArray[4] + ";";
                var doesLeafExist = eval(nextstrbranch);
                if (doesLeafExist == null) {
                    this.strErrorID = "201";
                    return false;
                }

                // check for write only
                strread = "existingObjectiveHandle." + cmiArray[3] + "." + cmiArray[4] + ".cmireadStatus;";
                var isWriteOnly = eval(strread);
                if (isWriteOnly == "readonly") {
                    this.strErrorID = "403";
                    return false;
                }

                // see if value exists
                strleaf = "existingObjectiveHandle." + cmiArray[3] + "." + cmiArray[4] + ".cmivalue;";
                var doesLeafExist = eval(strleaf);
                if (doesLeafExist == null) {
                    this.strErrorID = "201";
                    return false;
                }
                else {
                    // check the datatype and vocabulary...
                    var datatype = doesLeafExist.cmidatatype;
                    res = API.ServerSco.checkDataTypeAndVocab(element, value, datatype);
                    if (res == "true") {
                        // correct datatype...
                        // WE CAN NOW TRY TO SET THE FULL OBJECT REFERENCE
                        var strleafval = "doesLeafExist.cmivalue =\"" + value + "\";";
                        var leafVal = eval(strleafval);
                        if (leafVal == null) {
                            // IT FAILED AT THE FINAL HURDLE...
                            this.strErrorID = "201";
                            return false;
                        }
                        else {
                            this.strErrorID = "0";
                            return true;
                        }
                    }
                    else {
                        // incorrect data type...
                        this.strErrorID = "405";
                        return false;
                    }
                }
            }
            if (cmiArray.length == 6) {
                // check object exists
                strbranch = "existingObjectiveHandle." + cmiArray[3];
                var doesBranchExist = eval(strbranch);
                if (doesBranchExist == null) {
                    this.strErrorID = "201";
                    return false;
                }
                // The fifth argument should be an array reference, so do some checking...

                // IF 5TH ARG IS NOT A NUMBER THEN THROW ERROR
                // need to check cmiArray[4] to see if its a number
                if (isNaN(cmiArray[4])) {
                    this.strErrorID = "401";
                    return false;
                }

                // check to see if this element has a _count
                // If it hasn't we'll have to throw an error here
                // because we need the correct array index for array #2...
                var theCount = "existingObjectiveHandle." + cmiArray[3] + "._count.cmivalue;";
                var hasCount = eval(theCount);
                // CANT FIND _COUNT FOR THIS ELEMENT, SO THROW AN ERROR...
                if (hasCount == null) {
                    this.strErrorID = "201";
                    return false;
                }
                // next need to check to see if array ref is in array bounds
                if (cmiArray[4] > hasCount || cmiArray[4] < 0) {
                    // call to array is out of bounds
                    this.strErrorID = "201";
                    return false;
                }

                // make sure that array index 4 is either 'objectives' or 'correct_responses'
                if (cmiArray[3] == "objectives") {
                    // next check that there is an object here at this array index...
                    var arrayIndex2Check = eval("existingObjectiveHandle." + cmiArray[3] + ".objectivesInteractionArray(" + cmiArray[4] + ")");
                    // check for null
                    if (arrayIndex2Check == null) {
                        this.strErrorID = "201";
                        return false;
                    }
                    else {
                        // next check that the last element is valid...
                        finalObjectCheck = eval("arrayIndex2Check." + cmiArray[5]);
                        if (finalObjectCheck == null) {
                            this.strErrorID = "201";
                            return false;
                        }
                        else {
                            // call must be to a valid element in the model so...
                            // check it for readonly...
                            isWriteonly = eval("finalObjectCheck.cmireadStatus");
                            if (isWriteonly == "readonly") {
                                this.strErrorID = "403";
                                return false;
                            }
                            else {

                                // check the datatype and vocabulary...
                                var datatype = finalObjectCheck.cmidatatype;
                                res = API.ServerSco.checkDataTypeAndVocab(element, value, datatype);
                                if (res == "true") {
                                    // correct datatype...
                                    // WE CAN NOW TRY TO SET THE FULL OBJECT REFERENCE
                                    var strleafval = "finalObjectCheck.cmivalue =\"" + value + "\";";
                                    var leafVal = eval(strleafval);
                                    if (leafVal == null) {
                                        // IT FAILED AT THE FINAL HURDLE...
                                        this.strErrorID = "201";
                                        return false;
                                    }
                                    else {
                                        this.strErrorID = "0";
                                        return false;
                                    }
                                }
                                else {
                                    // incorrect data type...
                                    this.strErrorID = "405";
                                    return false;
                                }
                            }
                        }
                    }
                }
                else if (cmiArray[3] == "correct_responses") {
                    // next check that there is an object here at this array index...
                    var arrayIndex2Check = eval("existingObjectiveHandle." + cmiArray[3] + ".correctResponsesInteractionArray(" + cmiArray[4] + ")");
                    // check for null
                    if (arrayIndex2Check == null) {
                        this.strErrorID = "201";
                        return false;
                    }
                    else {
                        // next check that the last element is valid...
                        finalObjectCheck = eval("arrayIndex2Check." + cmiArray[5]);
                        if (finalObjectCheck == null) {
                            this.strErrorID = "201";
                            return false;
                        }
                        else {
                            // call must be to a valid element in the model so...
                            // check it for readonly...
                            isWriteonly = eval("finalObjectCheck.cmireadStatus");
                            if (isWriteonly == "readonly") {
                                this.strErrorID = "403";
                                return false;
                            }
                            else {
                                // check the datatype and vocabulary...
                                var datatype = finalObjectCheck.cmidatatype;
                                res = API.ServerSco.checkDataTypeAndVocab(element, value, datatype);
                                if (res == "true") {
                                    // correct datatype...
                                    // WE CAN NOW TRY TO SET THE FULL OBJECT REFERENCE
                                    var strleafval = "finalObjectCheck.cmivalue =\"" + value + "\";";
                                    var leafVal = eval(strleafval);
                                    if (leafVal == null) {
                                        // IT FAILED AT THE FINAL HURDLE...
                                        this.strErrorID = "201";
                                        return false;
                                    }
                                    else {
                                        this.strErrorID = "0";
                                        return true;
                                    }
                                }
                                else {
                                    // incorrect data type...
                                    this.strErrorID = "405";
                                    return false;
                                }

                            }
                        }
                    }
                }
                else {
                    // throw an error because 4th arg was not either
                    // objectives or correct_responses
                    this.strErrorID = "201";
                    return false;
                }

            }

        }
    }

}
function dealWithSettingObjectives(element, value, objXMLElementValuesL) {
    //  _CHILDREN ARE READONLY
    if (element == "cmi.objectives._children") {
        this.strErrorID = "402";
        return false;
    }
    //  _COUNT IS READ ONLY
    if (element == "cmi.objectives._count") {
        this.strErrorID = "402";
        return false;
    }

    // ELSE CHECK THAT THE ELEMENT IS VALID AND HAS AT LEAST 3 PARAMS
    var cmiArray = element.split(".");
    if (cmiArray.length < 3) {
        this.strErrorID = "201";
        return false;
    }

    // IF 3RD ARG IS NOT A NUMBER THEN THROW ERROR
    // need to check cmiArray[2] to see if its a number
    if (isNaN(cmiArray[2])) {
        this.strErrorID = "401";
        return false;
    }
    var objSearchNode = selectSingleNode(objXMLElementValuesL.getElementsByTagName("DataElement"), "Name", "cmi.objectives._count");    
    if (objSearchNode != null) {
        var theCount = objSearchNode.value;
        // IF ITS A NUMBER MAKE SURE ITS IN THE ARRAY BOUNDS
        if (cmiArray[2] > theCount || cmiArray[2] < 0) {
            // call to array is out of bounds
            this.strErrorID = "201";
            return false;
        }
        else if (cmiArray[2] == theCount || cmiArray[2] < theCount) {

        }
    }
    else {
        this.strErrorID = "201";
        return false;
    }
}
