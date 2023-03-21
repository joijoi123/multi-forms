export const spaForm = () => {
  let currentStep = 1;
  let intervalID = 0;
  let opacity = 0;

  const init = () => {
    const forms = document.querySelectorAll('[sayu-form-step]');
    forms.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
      (element as HTMLElement).style.opacity = '0';
    });
    (forms[0] as HTMLElement).style.display = 'flex';
    (forms[0] as HTMLElement).style.opacity = '1';
    loaded();
  };

  const getTotalStep = () => document.querySelectorAll('[sayu-form-step]').length;
  const getWarningEle = () => {
    return document.querySelectorAll('[sayu-form=' + "'" + 'warning' + "'" + ']')[0] as HTMLElement;
  };
  const getLoadingElement = () =>
    document.querySelectorAll('[sayu-form-loading]')[0] as HTMLElement;
  const getFormStep = (currentStep: number) => {
    return document.querySelectorAll(
      '[sayu-form-step=' + "'" + currentStep + "'" + ']'
    )[0] as HTMLElement;
  };
  const loaded = () => {
    const totalStep = getTotalStep();
    const btnNext = document.querySelector("[sayu-button='next']");
    const btnPrev = document.querySelector("[sayu-button='prev']");
    btnNext?.addEventListener('click', clickNext);
    btnPrev?.addEventListener('click', clickPrev);
    (btnPrev as HTMLElement).style.display = 'none';
    const loading = getLoadingElement();
    loading.style.width = `${(currentStep * 100) / totalStep}%`;
    showWarning(false);
  };
  const showWarning = (isFlag: boolean) => {
    const warning = getWarningEle();
    isFlag ? (warning.style.display = 'flex') : (warning.style.display = 'none');
  };
  const fadeIn = (ele: any) => {
    intervalID = setInterval(() => {
      if (opacity < 1) {
        opacity = opacity + 0.01;
        (ele as HTMLElement).style.opacity = `${opacity}`;
      } else {
        opacity = 0;
        clearInterval(intervalID);
      }
    }, 0);
  };
  const requiredFields = () => {
    const query =
      '[sayu-form-wrapper=' +
      "'" +
      currentStep +
      "'" +
      '][sayu-form=' +
      "'" +
      'required' +
      "'" +
      ']';
    return document.querySelectorAll(query);
  };

  const validateFormStep = () => {
    const fields = requiredFields();
    let result = false;
    fields.forEach((ele) => {
      if (ele.tagName === 'DIV') {
        const radioList = ele.querySelectorAll('[required]');
        result = validateRadioGroup(radioList);
      }
      if (ele.tagName === 'INPUT') {
        result = validateTextInput(ele as HTMLInputElement);
      }
    });
    return result;
  };
  const validateRadioGroup = (radiolist: NodeList) => {
    let result = false;
    radiolist.forEach((ele: unknown) => {
      const item = ele as HTMLInputElement;
      if (item.checked === true) {
        result = true;
        return result;
      }
    });
    return result;
  };

  const validateTextInput = (input: HTMLInputElement) => {
    if (input?.value.length === 0) {
      return false;
    }
    return true;
  };
  const clickNext = (e: unknown) => {
    const totalStep = getTotalStep();
    const isValid = validateFormStep();

    if (!isValid) {
      // show warning here
      showWarning(true);
      return;
    }
    showWarning(false);
    const prevForm = getFormStep(currentStep);
    // eslint-disable-next-line no-plusplus
    currentStep++;
    currentStep > totalStep ? (currentStep = totalStep) : null;

    const currentForm = getFormStep(currentStep);
    prevForm.style.display = 'none';
    currentForm.style.display = 'flex';
    fadeIn(currentForm);
    if (currentStep > 1) {
      const btnPrev = document.querySelectorAll("[sayu-button='prev']")[0] as HTMLElement;
      btnPrev.style.display = 'inline-block';
    }
    if (currentStep === getTotalStep()) {
      const btnNext = document.querySelector("[sayu-button='next']") as HTMLElement;
      btnNext.style.display = 'none';
    }
    const loading = getLoadingElement();
    loading.style.width = `${(currentStep * 100) / totalStep}%`;
  };

  const clickPrev = () => {
    showWarning(false);
    const totalStep = getTotalStep();
    const prevForm = getFormStep(currentStep);
    // eslint-disable-next-line no-plusplus
    currentStep--;
    currentStep < 1 ? (currentStep = 1) : null;
    const currentForm = getFormStep(currentStep);
    prevForm.style.display = 'none';
    currentForm.style.display = 'flex';
    fadeIn(currentForm);
    if (currentStep === 1) {
      const btnPrev = document.querySelectorAll("[sayu-button='prev']")[0] as HTMLElement;
      btnPrev.style.display = 'none';
      const btnNext = document.querySelector("[sayu-button='next']") as HTMLElement;
      btnNext.style.display = 'flex';
    }
    if (currentStep === totalStep) {
      const btnNext = document.querySelector("[sayu-button='next']") as HTMLElement;
      btnNext.style.display = 'none';
    } else if (currentStep < totalStep) {
      const btnNext = document.querySelector("[sayu-button='next']") as HTMLElement;
      btnNext.style.display = 'flex';
    }
    const loading = getLoadingElement();
    loading.style.width = `${(currentStep * 100) / totalStep}%`;
  };

  return init();
};
