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

  // Store the original trainingCentre options so we can restore them
  const defaultTrainingCentreOptions = Array.from(trainingCentre.options).map(opt => ({
    value: opt.value,
    text: opt.text
  }));

  [aircraftType, modelSelect].forEach(el => el.classList.add('field-animated'));

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
    "Beechcraft 1900D": ["Paris", "Zhengzhou"],
    "CRJ 200-700": ["Johannesburg"],
    "Dash 8": ["Johannesburg"],
    "Embraer E190": ["Johannesburg"],
    "E190": ["Johannesburg"],
    "Embraer ERJ 145": ["Johannesburg"],
  };

  const getSelectedText = (sel) => sel.options[sel.selectedIndex]?.text?.trim() || '';
  const isTypeRatingSelected = () => {
    const val = (trainingCourse.value || '').trim();
    const label = getSelectedText(trainingCourse);
    return val === 'Type Rating Training' || label === 'Type Rating Training';
  };

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
    void el.offsetWidth;
    el.classList.add('is-visible');
    el.disabled = false;
  }

  function hideField(el) {
    el.classList.remove('is-visible');
    el.disabled = true;
  }

  function onTrainingCourseChange() {
    if (isTypeRatingSelected()) {
      populateSelect(aircraftType, Object.keys(aircraftOptions), 'Select aircraft type');
      showField(aircraftType);
      populateSelect(modelSelect, [], 'Select a model');
      hideField(modelSelect);
      populateSelect(trainingCentre, [], 'Select a training centre');
      trainingCentre.disabled = true;
    } else {
      hideField(aircraftType);
      hideField(modelSelect);
      restoreTrainingCentreDefaults();
    }
  }

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

  trainingCourse.addEventListener('change', onTrainingCourseChange);
  aircraftType.addEventListener('change', onAircraftTypeChange);
  modelSelect.addEventListener('change', onModelChange);

  // Initial page load setup
  if (isTypeRatingSelected()) {
    populateSelect(aircraftType, Object.keys(aircraftOptions), 'Select aircraft type');
    showField(aircraftType);
  } else {
    hideField(aircraftType);
    hideField(modelSelect);
    restoreTrainingCentreDefaults();
  }
});
</script>