<style>
/* 300ms ease-in slide-from-bottom + fade */
.field-animated {
  opacity: 0;
  transform: translateY(16px);
  max-height: 0;           /* collapses space when hidden */
  overflow: hidden;
  pointer-events: none;
  transition: opacity 300ms ease-in, transform 300ms ease-in;
  display: none;
}
.field-animated.is-visible {
  opacity: 1;
  transform: translateY(0);
  max-height: 200px;       /* big enough for a select + label */
  pointer-events: auto;
  transition: opacity 300ms ease-in, transform 300ms ease-in;
  display: block;
}

/* Optional: basic disabled look for trainingCentre when not ready */
select:disabled {
  background-color: #f2f2f2;
  color: #888;
}
</style>

<style>
/* 300ms ease-in slide-from-bottom + fade */
.field-animated {
  opacity: 0;
  transform: translateY(16px);
  max-height: 0;           /* collapses space when hidden */
  overflow: hidden;
  pointer-events: none;
  transition: opacity 300ms ease-in, transform 300ms ease-in;
  display: none;
}
.field-animated.is-visible {
  opacity: 1;
  transform: translateY(0);
  max-height: 200px;       /* big enough for a select + label */
  pointer-events: auto;
  transition: opacity 300ms ease-in, transform 300ms ease-in;
  display: block;
}

/* Optional: basic disabled look for trainingCentre when not ready */
select:disabled {
  background-color: #f2f2f2;
  color: #888;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const trainingCourse  = document.getElementById('trainingCourse');
  const aircraftType    = document.getElementById('aircraftType');
  const modelSelect     = document.getElementById('modelSelect');
  const trainingCentre  = document.getElementById('trainingCentre');

  if (!trainingCourse || !aircraftType || !modelSelect || !trainingCentre) {
    console.error('One or more fields not found. Ensure IDs: trainingCourse, aircraftType, modelSelect, trainingCentre');
    return;
  }

  // Save original trainingCentre options (HTML defaults)
  const defaultTrainingCentreOptions = Array.from(trainingCentre.options).map(opt => ({
    value: opt.value,
    text: opt.text
  }));

  [aircraftType, modelSelect].forEach(el => el.classList.add('slide-fade'));

  // Data for aircraft flow
  const aircraftOptions = {
    Airbus: ["A320", "A320 NEO", "A330", "A340", "A350"],
    ATR: ["ATR 72-500", "ATR 72-600"],
    Boeing: ["B737 CL", "B737 NG", "B757", "B767", "B777"],
    Other: ["Beechcraft 1900D", "CRJ 200-700", "Dash 8", "Embraer E190", "Embraer ERJ 145", "MD 82"]
  };

  const centresByModel = {
    "A320": ["Paris", "Changsha"],
    "A320 NEO": ["Paris", "Changsha"],
    "A330": ["Paris"],
    "A340": ["Paris"],
    "A350": ["Paris"],
    "ATR 72-500": ["Paris", "Johannesburg"],
    "ATR 72-600": ["Paris"],
    "B737 CL": ["Paris"],
    "B737 NG": ["Paris"],
    "B757": ["Paris"],
    "B767": ["Paris"],
    "B777": ["Paris"],
    "B787": ["Paris"],
    "Beechcraft 1900D": ["Johannesburg"],
    "CRJ 200-700": ["Johannesburg"],
    "Dash 8": ["Johannesburg"],
    "Embraer E190": ["Johannesburg"],
    "E190": ["Johannesburg"],
    "Embraer ERJ 145": ["Johannesburg"],
    "MD 82": []
  };

  // New mapping: direct course -> trainingCentre
  const centresByCourse = {
    "CCQ": ["Paris"],
    "TBM Training": ["Paris"],
    "MCC Course": ["Paris"],
    "Instructor & Examiner Courses": ["Paris", "Johannesburg"],
    "Difference Courses": ["Paris", "Johannesburg"],
    "Operational Courses": ["Paris", "Johannesburg"]
  };

  // Helpers
  function populateSelect(selectEl, options, placeholder = 'Select an option') {
    selectEl.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = placeholder;
    selectEl.appendChild(ph);

    options.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      selectEl.appendChild(o);
    });
    selectEl.selectedIndex = 0;
  }

  function restoreTrainingCentreDefaults() {
    trainingCentre.innerHTML = '';
    defaultTrainingCentreOptions.forEach(optData => {
      const opt = document.createElement('option');
      opt.value = optData.value;
      opt.textContent = optData.text;
      trainingCentre.appendChild(opt);
    });
    trainingCentre.disabled = false;
  }

  function showField(el) {
    el.style.display = 'block';
    void el.offsetWidth;
    el.classList.add('show');
    el.disabled = false;
  }

  function hideField(el) {
    el.classList.remove('show');
    setTimeout(() => {
      el.style.display = 'none';
      el.disabled = true;
    }, 300);
  }

  // Logic when trainingCourse changes
  function onTrainingCourseChange() {
    const course = trainingCourse.value.trim();

    if (course === "Type Rating Training") {
      // Normal aircraft flow
      populateSelect(aircraftType, Object.keys(aircraftOptions), 'Select aircraft type');
      showField(aircraftType);
      populateSelect(modelSelect, [], 'Select a model');
      hideField(modelSelect);
      populateSelect(trainingCentre, [], 'Select a training centre');
      trainingCentre.disabled = true;
    } 
    else if (centresByCourse[course]) {
      // Direct course -> centre flow
      hideField(aircraftType);
      hideField(modelSelect);
      populateSelect(trainingCentre, centresByCourse[course], 'Select a training centre');
      trainingCentre.disabled = false;
    } 
    else {
      // Restore defaults for all other courses
      hideField(aircraftType);
      hideField(modelSelect);
      restoreTrainingCentreDefaults();
    }
  }

  // Aircraft type change
  function onAircraftTypeChange() {
    const type = aircraftType.value;
    if (type && aircraftOptions[type]) {
      populateSelect(modelSelect, aircraftOptions[type], 'Select a model');
      showField(modelSelect);
      populateSelect(trainingCentre, [], 'Select a training centre');
      trainingCentre.disabled = true;
    } else {
      hideField(modelSelect);
      restoreTrainingCentreDefaults();
    }
  }

  // Model change
  function onModelChange() {
    const model = modelSelect.value;
    const centres = centresByModel[model] || [];
    if (centres.length > 0) {
      populateSelect(trainingCentre, centres, 'Select a training centre');
      trainingCentre.disabled = false;
    } else {
      populateSelect(trainingCentre, [], 'No centres available');
      trainingCentre.disabled = true;
    }
  }

  // Events
  trainingCourse.addEventListener('change', onTrainingCourseChange);
  aircraftType.addEventListener('change', onAircraftTypeChange);
  modelSelect.addEventListener('change', onModelChange);

  // Initial setup
  onTrainingCourseChange();
});
</script>
