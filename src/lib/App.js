// @flow
import 'lib/css/App.css';

class App {
  myVar: boolean = true;

  constructor() {
    const { myArrowMethod, myVar } = this;
    console.log('Lib constructor called', myVar);
    myArrowMethod();
  }

  myArrowMethod = () => {
    console.log('Arrow method fired');
  };
}

export default App;
