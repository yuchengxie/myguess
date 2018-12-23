export default (state = 0, action) => {
  switch (action.type) {
    case "save":
      return state + 1;
    default:
      return state;
  }
};
