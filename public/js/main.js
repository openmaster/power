'use strict';
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ProjectView: true };
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(){
    const current = this.state.ProjectView
    this.setState({ProjectView: !current});
}

  render() {
    const projectView = this.state.ProjectView
    let view;
    if(projectView){
        return(
            <div>
                <nav className="navbar navbar-light bg-light">
                    <div className="container">
                        <img src="../logo/logo.png" width="140" height="35" alt=""></img>
                        <h5>Portable Meter Project File.</h5>
                        <button className="btn btn-sm btn-outline-primary" onClick={this.handleClick}>Create CT's File </button>
                        <p className="lead">You can convert clean excel file to xml project file and share it with developers.</p>
                    </div>
                </nav>  
                <CreateProjectFile/>
            </div>
        );
    } else {
        return(
            <div>
                <nav className="navbar navbar-light bg-light">
                <div className="container">
                    <img src="../logo/logo.png" width="140" height="35" alt=""></img>
                    <h5 className="">Portable Meter CT's File.</h5>
                    <button className="btn btn-sm btn-outline-primary float-right" onClick={this.handleClick}>Create Project File </button>
                    <p className="lead">You can combine CT data, create a CT's file and share the CT's files with developers.</p>    
                </div>
                </nav>  
                <CreateCTs/>
            </div>
        );
    }
  }
}

const domContainer = document.querySelector('#com');
ReactDOM.render(<Menu/>, domContainer);