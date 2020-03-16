'use strict';
class DownloadNShare extends React.Component{
    constructor(props){
        super(props);
        this.state = {fileName: this.props.fileName, fileData: this.props.fileData, error: null, share: false}
        this.downloadFile = this.downloadFile.bind(this);
    }
    sharingFile(sharingOn){
        if(sharingOn){
            return(
                <div className="alert alert-primary">
                    <form>
                        <p>Please Enter the email address to share with.</p>
                        <input className="form-control form-control-sm mb-2" type="email" placeholder="Email"/>
                        <button className="btn btn-sm btn-outline-primary mb-2" >Share</button>
                        <button className="btn btn-sm btn-link float-right" onClick={() => this.setState({share: false})}>Dont Share</button>
                    </form>
                </div>
            );
        }

    }
    downloadFile(){
        const fileName = this.state.fileName;
        const data = this.state.fileData;
        if(!fileName || !data){
            this.setState({error: "Error !! Invalid file name or file content."});
            return;
        }

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    } 
    DownloadNShareButtons(sharingOn) {
        if(!sharingOn){
            return(
                <div className="alert alert-primary" >
                    Your file is ready to download and Share.&nbsp; 
                    <button className="btn btn-sm btn-link float-right" onClick={this.downloadFile}>Download</button>
                    <button className="btn btn-sm btn-link float-right" onClick={() => this.setState({share:true})}>Share</button>
                </div>
            );
        }
    }
    render(){
        let err = this.state.error;
        let sharingOn = this.state.share;
        if(err){
            return(<div className="alert alert-danger" role="alert">{err.toString()}</div>);
        } else {
            return(
                <div>
                    {this.DownloadNShareButtons(sharingOn)}
                    {this.sharingFile(sharingOn)}
                </div>
            );
        }
    }
}

class CreateProjectFile extends React.Component{
    constructor(props){
        super(props);
        this.state = {fileContent: null, error: null, fileName: null}
        this.uploadFile = this.uploadFile.bind(this);
    }
  
    render(){
        const fileContent = this.state.fileContent;
        let error = this.state.error
        return(
            <div className="container">
                <form id="myForm" name="myForm">
                    <input className="form-control-file" type="file" id="fileUploder" name="uploadedFile" accept="application/vnd.ms-excel" multiple={false} /> &nbsp;
                </form>
               <div>
                   {(fileContent) ? 
                    <DownloadNShare fileName={this.state.fileName} fileData={this.state.fileContent}/>
                    :
                    <button className="btn btn-sm btn-outline-info" placeholder="Select " onClick={this.uploadFile}>Process File</button>}
                </div>
                <div>
                    {
                        (error) ? <div className="alert alert-danger" role="alert">{error.toString()}</div> : <div></div>
                    }
                </div>
                
            </div>
        )
    }
    getFileName(){
        let nam = document.getElementById('fileUploder').files[0].name.toString();
        nam = nam.replace(/clean/gi, "")
        nam = nam.replace(/.xls/gi, "")
        nam = nam.replace(/^_/, "")
        nam = nam.replace(/_$/, "")
        nam = nam + "_project.xml"
        return nam;
    }
    uploadFile(){
        event.preventDefault();
        const file = document.getElementById('myForm');
        const fileName = this.getFileName();
        console.log(fileName);
        this.setState({fileName: fileName});
        let formData = new FormData(file);
        const request = {
            url: '/api/upload',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        axios(request).then((result) => {
            this.setState({fileContent: result.data});
        }).catch((err) => {
            this.setState({error: err});
            console.log(err);
        })
    }
}

class CreateCTs extends React.Component{
    render(){
        return(
            <div>
                <p>Lets create CT's file</p>
            </div>
        )        
    }
}

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
                    <span className="navbar-brand mb-0 h1">Convert excel to project XML and share with developer </span>
                    <button className="btn btn-sm btn-outline-primary" onClick={this.handleClick}>Create CT's File </button>
                </nav>  
                <CreateProjectFile/>
            </div>
        );
    } else {
        return(
            <div>
                <nav className="navbar navbar-light bg-light">
                    <span className="navbar-brand mb-0 h1">Combine and share CT's files with developer</span>
                    <button className="btn btn-sm btn-outline-primary" onClick={this.handleClick}>Create Project File </button>    
                </nav>
                <CreateCTs/>
            </div>
        );
    }
  }
}

const domContainer = document.querySelector('#com');
ReactDOM.render(<Menu/>, domContainer);