function makeCounter() {
	var currentCount = 0;
	return function() {
		return currentCount++;
	};
}

var cityCounter = makeCounter();
var areaCounter = makeCounter();

var testCities = [];

function newCity(isIndustrial, isCriminal, isPolluted, cityAreas = []) {
	var citySelf = this;
	citySelf["ID"] = "city" + cityCounter();

	var name = "New City";
	citySelf.getName = function() {
		return citySelf["Name"];
	}	
	citySelf.setName = function(newName) {
		if (validateText(newName, 100)) {
			citySelf["Name"] = newName;
			return true;
		}
	}
		
	citySelf["IsPolluted"] = isPolluted;
	citySelf["IsCriminal"] = isCriminal;
	citySelf["IsIndustrial"] = isIndustrial;
	citySelf["CityAreas"] = cityAreas;
	
	citySelf.displayAreasNames = function() {
		var cityAreasNamesText = "";
		if (citySelf["CityAreas"].length) {
			var cityAreasNamesArray = [];
			citySelf["CityAreas"].forEach(function (item, i, arr) {
				var areaName = item.getName();
				cityAreasNamesArray.push(areaName);
			})
			cityAreasNamesText = cityAreasNamesArray.join(", ");
		}
		else {
			cityAreasNamesText = "No areas";
		}
	return cityAreasNamesText;
	};
	

	citySelf.addNewArea = function(newCityArea) {
		citySelf["CityAreas"].push(newCityArea);
	}
	
	citySelf.deleteArea = function(i) {
		citySelf["CityAreas"].splice(i,1);
	}
	
	citySelf.isValid = function(){
		 return (validateText(citySelf.getName, 100)) ? true : false;
	}
}

function newArea(name, description, citizens) {
	var areaSelf = this;
	areaSelf["ID"] = "area" + areaCounter();
	
	var name = "New Area";
	areaSelf.getName = function() {
		return areaSelf["Name"];
	}	
	areaSelf.setName = function(newName) {
		if (validateText(newName, 100)) {
			areaSelf["Name"] = newName;
		}
	}
		
	var description = "Area Description";
	areaSelf.getDescription = function() {
		return areaSelf["Description"];
	}	
	areaSelf.setDescription = function(newDescr) {
		if (validateText(newDescr, 250)) {
			areaSelf["Description"] = newDescr;
		}
	}
		
	var citizens = 0;
	areaSelf.getCitizenAmount = function() {
		return areaSelf["CitizenAmount"];
	}	
	areaSelf.setCitizenAmount = function(newAmount) {
		if (validateNumber(newAmount)) {
			areaSelf["CitizenAmount"] = newAmount || "Unknown";
		}
	}
	
	areaSelf.editArea = function(newName, newDescr, newAmount) {
		areaSelf.setName(newName);
		areaSelf.setDescription(newDescr);
		areaSelf.setCitizenAmount(newAmount);
	}
	
	areaSelf.isValid = function(){
		return (validateText(areaSelf.getName, 100) && validateText(areaSelf.getDescription, 250) && validateNumber(areaSelf.getCitizenAmount)) ? true : false;
	}
	
}

var testCities = [];

var area0 = new newArea;
area0.setName("AreaA");
area0.setDescription("A very good area");
area0.setCitizenAmount(2000);

var area1 = new newArea;
area1.setName("AreaB");
area1.setDescription("A very bad area");
area1.setCitizenAmount(1000);

var area2 = new newArea;
area2.setName("AreaC");
area2.setDescription("A very beautiful area");
area2.setCitizenAmount(0);

var city0 = new newCity(true, false, false, [area0, area1, area2]);
city0.setName("CityA");
testCities.push(city0);

var city1 = new newCity(false, true, false, []);
city1.setName("CityB");
testCities.push(city1);

var area3 = new newArea;
area3.setName("AreaD");
area3.setDescription("A dangerous area");
area3.setCitizenAmount(15000);

var city2 = new newCity(true, true, false, [area3]);
city2.setName("CityC");
testCities.push(city2);

var area4 = new newArea;
area4.setName("AreaE");
area4.setDescription("A very nice area");
area4.setCitizenAmount(18000);

var area5 = new newArea;
area5.setName("AreaF");
area5.setDescription("A very dirty area");
area5.setCitizenAmount(0);

var city3 = new newCity(true, false, true, [area4, area5]);
city3.setName("CityD");
testCities.push(city3);

var city4 = new newCity(false, true, false, []);
city4.setName("CityE");
testCities.push(city4);

var collapseCounter = 0;
var cities = [];
var localStorageCities = allStorage();

if (localStorageCities.length > 0) {
    cities = localStorageCities;
} else {
    cities = testCities;
}

function allStorage() {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    while (i--) {
        values.push(JSON.parse(localStorage.getItem(keys[i])));
    }
    return values;
}

function addToStorage(id, city) {
    localStorage.setItem(id, city);
}

function deleteFromStorage(id) {
    localStorage.removeItem(id);
}

function createElement(type, classNames, parent, content, attributes) {
    var newElem = document.createElement(type);
    newElem.className = classNames;
    parent.appendChild(newElem);
    if (content) {
        newElem.textContent = content;
    }
    if (attributes) {
        for (key in attributes) {
            newElem.setAttribute(key, attributes[key]);
        }
    }
    return newElem;
}

function defineButtonClass(button, prop) {
    if (prop) {
        button.classList.add("button_right_true");
    }
    else {
        button.classList.remove("button_right_true");
    }
}

function toggleClassButtons(button, item, propName) {
	if (item) {
		item[propName] = !item[propName];
	}
    button.classList.toggle("button_right_true");
}

function validateText(str, len) {
    if (str.length > len) {
        alert("A too long string! Only " + len + " symbols are allowed.");
        return false;
    }
    if (str.search(/</m) != -1) {
        alert("The text contains incorrect symbols!")
        return false;
    }
    if ((str == null) || (str.length == 0)) {
        alert("The required field is not filled!");
        return false;
    }
    return true;
}

function validateNumber(str) {
    str = +str;
    if (isNaN(str)) {
        alert("Enter the number!");
        return false;
    }
    if (str < 0) {
        alert("Enter a positive number!");
        return false;
    }
    if (str !== Math.ceil(str)) {
        alert("Enter an integer number!");
        return false;
    }
    return true;
}

function clickOutside(popupId, func) {
    var specifiedElement = document.getElementById(popupId);
    var doc = document;
    doc.onclick = function (event) {
        var isClickInside = specifiedElement.contains(event.target);
        if (!isClickInside) {
            specifiedElement.style.display = 'none';				
			if (func) {
				func();
			}
        }
    }
}

function createAccordionBlock(item, i, arr) {
    var divPanel = createElement('div', 'panel panel-default', document.getElementById('accordion'), null, { "ID": item["ID"] });
    var aCollapse = createElement('a', 'toggleCity', divPanel, null, { 'href': "#collapse" + collapseCounter, 'data-toggle': 'collapse' });
    var divPanelCollapse = createElement('div', 'panel-collapse collapse', divPanel, null, { 'id': "collapse" + collapseCounter });
    collapseCounter++;
    var divBlock = createElement('div', 'block city_block container well', aCollapse);
    var deleteButton = createElement('div', 'button_left del_btn', divBlock, "X");
    var editButton = createElement('div', 'button_left edit_btn', divBlock, "E");
    var cityName = createElement('div', 'city_name name', divBlock, item.getName());
    var areasName = createElement('div', 'areas_name details', divBlock, item.displayAreasNames());
    var pollutedButton = createElement('div', 'button_right pol_btn', divBlock, "P");
    var criminalButton = createElement('div', 'button_right crim_btn', divBlock, "C");
    var industrialButton = createElement('div', 'button_right ind_btn', divBlock, "I");
    defineButtonClass(pollutedButton, item["IsPolluted"]);
    defineButtonClass(criminalButton, item["IsCriminal"]);
    defineButtonClass(industrialButton, item["IsIndustrial"]);
   
    pollutedButton.addEventListener('click', function (event) {
        toggleClassButtons(this, item, "IsPolluted");
		addToStorage(item["ID"], JSON.stringify(item));
        event.stopPropagation();
    })

    criminalButton.addEventListener('click', function (event) {
        toggleClassButtons(this, item, "IsCriminal");
		addToStorage(item["ID"], JSON.stringify(item));
        event.stopPropagation();
    })

    industrialButton.addEventListener('click', function (event) {
        toggleClassButtons(this, item, "IsIndustrial");
		addToStorage(item["ID"], JSON.stringify(item));
        event.stopPropagation();
    })

    deleteButton.addEventListener("click", function () {
        var del_confirm = confirm("Do you want to delete this city?");
        if (del_confirm) {
			var parElem = this.parentElement.parentElement.parentElement;
            var deleteId = parElem.getAttribute('id');
            parElem.remove();
            arr.forEach(function (item, i, arr) {
                if (item["ID"] == deleteId) {
					arr.splice(i, 1);
                }
            })
            deleteFromStorage(item["ID"]);
        }
    })

    editButton.addEventListener("click", function (event) {
        event.stopPropagation();
        editCity();
    })

    function editCity() {
        var cityPopup = document.getElementById("edit_city");
		cityPopup.querySelector('.edit_title h4').innerHTML = "Edit City";
        document.getElementById('inputCityName').value = item.getName();
        var indButton = document.getElementById('ind_button');
        var crimButton = document.getElementById('crim_button');
        var polButton = document.getElementById('pol_button');
		var submitButton = document.getElementById("submit_btn_city");
        defineButtonClass(indButton, item["IsIndustrial"]);
        defineButtonClass(crimButton, item["IsCriminal"]);
        defineButtonClass(polButton, item["IsPolluted"]);
        cityPopup.style.display = 'block';

        indButton.addEventListener('click', toggleIndClicked);
        crimButton.addEventListener('click', toggleCrimClicked);
        polButton.addEventListener('click', togglePolClicked);
        submitButton.addEventListener('click', submitCityButton);

        function toggleIndClicked() {
            toggleClassButtons(indButton, item, "IsIndustrial");
        }

        function toggleCrimClicked() {
            toggleClassButtons(crimButton, item, "IsCriminal");
        }

        function togglePolClicked() {
            toggleClassButtons(polButton, item, "IsPolluted");
        }
		
		function unsubscribeButtons() {
			submitButton.removeEventListener('click', submitCityButton);
			indButton.removeEventListener('click', toggleIndClicked);
			crimButton.removeEventListener('click', toggleCrimClicked);
			polButton.removeEventListener('click', togglePolClicked);
		}
		
		clickOutside('edit_city', function() 
		{
			unsubscribeButtons();
		});        

        function submitCityButton() {
            var inputCity = document.getElementById('inputCityName');
            var formCityName = inputCity.value;
            if (item.setName(formCityName)) {
                var editedBlock = editButton.parentElement;
                var newName = editedBlock.querySelector('.city_name');
                newName.textContent = item.getName();
                defineButtonClass(pollutedButton, item["IsPolluted"]);
                defineButtonClass(criminalButton, item["IsCriminal"]);
                defineButtonClass(industrialButton, item["IsIndustrial"]);
                document.getElementById("edit_city").style.display = 'none';
                unsubscribeButtons();
                addToStorage(item["ID"], JSON.stringify(item));
            }
            else { inputCity.focus(); }
        }

        var cancelButton = document.getElementById("cancel_btn_city");
        cancelButton.onclick = function () {
            document.getElementById("edit_city").style.display = 'none';
            unsubscribeButtons();
        }
    }

    var areasBlock = createElement('div', 'areas_block', divPanelCollapse);
    var addNewArea = createElement('div', 'add_area add_link', areasBlock, "Add New Area");

    function createAreaBlock(item, i, arr) {
        item["ID"] = "area" + areaCounter;
        var divAreaBlock = createElement('div', 'block area_block container well', areasBlock, null, { 'id': "area" + areaCounter });
        var deleteAreaButton = createElement('div', 'button_left del_btn', divAreaBlock, "X");
        var editAreaButton = createElement('div', 'button_left edit_btn', divAreaBlock, "E");
        var areaName = createElement('div', 'area_name name', divAreaBlock, item.getName());
        var areaDescription = createElement('div', 'area_description details', divAreaBlock, item.getDescription());
        var areaCitizens = createElement('div', 'area_citizens details', divAreaBlock, item.getCitizenAmount());
        var city = getCityByAreaID(item["ID"]);

        deleteAreaButton.addEventListener("click", deleteArea);

        function getCityByAreaID(id) {
            for (var i = 0; i < cities.length; i++) {
                var city = cities[i];
                var cityArias = city["CityAreas"];
                for (var j = 0; j < cityArias.length; j++) {
                    var cityArea = cityArias[j];
                    if (cityArea["ID"] == id) {
                        return city;
                    }
                }
            }
        }

        function deleteArea() {
            var del_confirm = confirm("Do you want to delete this area?");
            var city = getCityByAreaID(item["ID"]);
            if (del_confirm) {
                var deleteId = this.parentElement.getAttribute('ID');
                this.parentElement.remove();
				item["Name"] = "lalala"
				alert(item["Name"]);
                arr.forEach(function (item, i, arr) {
                    if (item["ID"] == deleteId) {
						//arr.splice(i, 1);
                        newCity.deleteArea(i);
                    }
                })

                newCity.displayAreasNames();
                areasName.textContent = areasNameText;
                addToStorage(city["ID"], JSON.stringify(city));
            }
            if (!arr.length) {
                var noAreasDiv = createElement('div', 'no_areas text-center', areasBlock, "No Areas");
            }
        }

        editAreaButton.addEventListener('click', function(event) {
            event.stopPropagation();

            var areaPopup = document.getElementById("edit_area");
			areaPopup.querySelector('.edit_title h4').innerHTML = "Edit Area";
            document.getElementById('inputAreaName').value = item.getName();
            document.getElementById('inputAreaDescription').value = item.getDescription();
            document.getElementById('inputAreaCitizens').value = item.getCitizenAmount();
            areaPopup.style.display = 'block';
            var submitButton = document.getElementById("submit_btn_area");
			submitButton.addEventListener('click', submitArea);
            
			clickOutside('edit_area', function() {
				submitButton.removeEventListener('click', submitArea);
			});

			function submitArea() {
				if (validateData(item)){
					var editedBlock = editAreaButton.parentElement;
					var newName = editedBlock.querySelector('.area_name');
					newName.textContent = item.getName();
					var newDescription = editedBlock.querySelector('.area_description');
					newDescription.textContent = item.getDescription();
					var newCitizens = editedBlock.querySelector('.area_citizens');
					newCitizens.textContent = item.getCitizenAmount();
					document.getElementById("edit_area").style.display = 'none';
					var parentElem = editedBlock.closest('.panel-default');
					newCity.displayAreasNames();
					parentElem.querySelector('.areas_name').textContent = areasNameText;
					addToStorage(city["ID"], JSON.stringify(city));
					submitButton.removeEventListener('click', submitArea);
				}
			}

			var cancelButton = document.getElementById("cancel_btn_area");
			cancelButton.onclick = function() {
				document.getElementById("edit_area").style.display = 'none';
				submitButton.removeEventListener('click', submitArea);
			}
        })

        areaCounter++;
    }

    if (item["CityAreas"].length) {
        item["CityAreas"].forEach(createAreaBlock);
    } else {
        var noAreasDiv = createElement('div', 'no_areas text-center', areasBlock, "No areas");
    }

    function validateData(elem) {
        var inputArea = document.getElementById('inputAreaName');
        var formAreaName = inputArea.value;
		if (validateText(formAreaName, 100)) {
            elem.setName(formAreaName);
            var inputDescription = document.getElementById('inputAreaDescription');
            var formAreaDescription = inputDescription.value;
            if (validateText(formAreaDescription, 250)) {
                elem.setDescription(formAreaDescription);
                var inputCitizens = document.getElementById('inputAreaCitizens');
                var formAreaCitizens = +inputCitizens.value;
                if (validateNumber(formAreaCitizens)) {
                    elem.setCitizenAmount(formAreaCitizens);
                }
                else { inputCitizens.focus(); 
				return false;}
            }
            else { inputDescription.focus(); 
			return false;}
        }
        else { inputArea.focus(); 
		return false;}
	return true;	
    }

    addNewArea.addEventListener('click', function (event) {
        event.stopPropagation();
        var areaPopup = document.getElementById("edit_area");
        areaPopup.querySelector('.edit_title h4').innerHTML = "Create New Area";
        areaPopup.style.display = 'block';
        var newAreaObject = {};
        document.getElementById('inputAreaName').value = "";
        document.getElementById('inputAreaDescription').value = "";
        document.getElementById('inputAreaCitizens').value = "";
		var submitButton = document.getElementById("submit_btn_area");
        submitButton.addEventListener('click', submitNewArea);
        
		clickOutside('edit_area', function() {
			submitButton.removeEventListener('click', submitNewArea);
		});
		
		function submitNewArea() {
			if (validateData(newAreaObject)){
				item["CityAreas"].push(newAreaObject);
				addToStorage(item["ID"], JSON.stringify(item));
				document.getElementById("edit_area").style.display = 'none';
				createAreaBlock(newAreaObject, item["CityAreas"].length, item["CityAreas"]);
				var editedBlock = addNewArea.parentElement.lastChild;
				var newName = editedBlock.querySelector('.area_name');
				newName.textContent = newAreaObject.getName();
				var newDescription = editedBlock.querySelector('.area_description');
				newDescription.textContent = newAreaObject.getDescription();
				var newCitizens = editedBlock.querySelector('.area_citizens');
				newCitizens.textContent = newAreaObject.getCitizenAmount();
				document.getElementById("edit_area").style.display = 'none';
				var parentElem = editedBlock.closest('.panel-default');
				var noAreasDiv = parentElem.querySelector('.no_areas');
				if (noAreasDiv) {
					noAreasDiv.parentElement.removeChild(noAreasDiv);
				}
				newCity.displayAreasNames();
				areasName.textContent = areasNameText;
				parentElem.querySelector('.areas_name').textContent = areasNameText;
				submitButton.removeEventListener('click', submitNewArea);
			}
		}
		
		var cancelButton = document.getElementById("cancel_btn_area");
		cancelButton.onclick = function () {
			document.getElementById("edit_area").style.display = 'none';
			submitButton.removeEventListener('click', submitNewArea);
		}
    })
}

var cityCounter = 0;
var areaCounter = 0;

cities.forEach(function (item, i, arr) {
    createAccordionBlock(item, i, arr);
    cityCounter++;
})

document.getElementById('add_city').addEventListener('click', function (event) {
    event.stopPropagation();
    addNewCity()
});
var cityPopup = document.getElementById("edit_city");
function addNewCity() {

    cityPopup.querySelector('.edit_title h4').innerHTML = "Create New City";
	document.getElementById('inputCityName').value = "";
    var indButton = document.getElementById('ind_button');
    var crimButton = document.getElementById('crim_button');
    var polButton = document.getElementById('pol_button');    
	var submitButton = document.getElementById("submit_btn_city");
	var cityLS = {"IsIndustrial": true, "IsCriminal": false, "IsPolluted": false};
    indButton.classList.add('button_right_true');
    crimButton.classList.remove('button_right_true');
    polButton.classList.remove('button_right_true');
    cityPopup.style.display = 'block';

    indButton.addEventListener('click', toggleIndClicked);
    crimButton.addEventListener('click', toggleCrimClicked);
    polButton.addEventListener('click', togglePolClicked);
    submitButton.addEventListener('click', submitNewCityButton);
	
    function toggleIndClicked() {
        toggleClassButtons(indButton, cityLS, "IsIndustrial");
    }
    function toggleCrimClicked() {
        toggleClassButtons(crimButton, cityLS, "IsCriminal");
    }
    function togglePolClicked() {
        toggleClassButtons(polButton, cityLS, "IsPolluted");
    }

	function unsubscribeButtons() {
		submitButton.removeEventListener('click', submitNewCityButton);
		indButton.removeEventListener('click', toggleIndClicked);
		crimButton.removeEventListener('click', toggleCrimClicked);
		polButton.removeEventListener('click', togglePolClicked);
	}

    function submitNewCityButton() {
        var inputNewCityNameLS = document.getElementById('inputCityName');
        var newCityNameLS = inputNewCityNameLS.value;
        if (validateText(newCityNameLS, 100)) {
            cityLS["ID"] = "city" + cityCounter;
            cityLS.setName(newCityNameLS);
            cityLS["CityAreas"] = [];
            cities.push(cityLS);
            addToStorage(cityLS["ID"], JSON.stringify(cityLS));
            createAccordionBlock(cityLS, cities.length - 1, cities);
            cityCounter++;
            cityPopup.style.display = 'none';

            unsubscribeButtons();
        }
        else { inputNewCityNameLS.focus(); }
    }

    var cancelButton = document.getElementById("cancel_btn_city");
    cancelButton.onclick = function () {
        cityPopup.style.display = 'none';
		unsubscribeButtons();
    }

    clickOutside('edit_city', function(){
		unsubscribeButtons();
	});        
}