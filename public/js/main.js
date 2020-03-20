'use strict';
class DownloadNShare extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fileName: this.props.fileName, 
            fileData: this.props.fileData, 
            error: null, 
            share: false, 
            uploading: false, 
            sharingResults: null
        }
        this.downloadFile = this.downloadFile.bind(this);
        this.shareFile = this.shareFile.bind(this);
    }

    getEmails(){
        const emails = [];
        const userInput = document.getElementById('emailToShare');
        if(userInput.value && userInput.value.toString().match(/\S+@\S+\.\S+/g)){
            //valid email only
            emails.push(userInput.value);
        }else{
            this.setState({error: 'Error! Please enter valid email address.'})
        }
        userInput.value = null;
        return(emails);
    }

    shareFile(){
        this.setState({uploading: true})
        event.preventDefault();
        const emails = this.getEmails();
        const payload = {emails: emails, fileName: this.state.fileName, fileContent: this.state.fileData}
        const request = {
            url: '/api/shareFile',
            method: 'POST',
            data: payload
        }
        axios(request).then(result => {
            const previousSharingResults = this.state.sharingResults || [];
            this.setState({uploading: false, sharingResults: previousSharingResults.concat(result.data)})
        }).catch(err => console.log(err));
    }

    sharingResult(){
        let results = this.state.sharingResults;
        if(results){
        const items = results.map((item) => <li className="list-group-item" key={item.email.toString()}> &#10025; {item.email} {(item.error)?<span>&#10006; {item.error}</span>:<span>&#10004;</span>}</li>);
            return(
                <ul className="list-group">
                    {items}
                </ul>
            );
        } else {
            return null;
        }
    }
    sharingButton(sharingOn){
        let uploading = this.state.uploading;
        if(sharingOn){
            return(
                <div className="alert alert-primary">
                    <form>
                        <mark className="float-right">{this.state.fileName}</mark><br />
                            Please Enter the email address to share the file with.
                        <input id="emailToShare" className="form-control form-control-sm mb-2" type="email" placeholder="Email"/>
                        <button className="btn btn-sm btn-primary mb-2" onClick={this.shareFile} disabled={uploading}>{(uploading)?'Uploading...':'Share'}</button>
                        <button className="btn btn-sm btn-link float-right" onClick={() => this.setState({share: false})}>Dont Share</button>
                    </form>
                    {this.sharingResult()}
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
        const fileName = this.state.fileName;
        if(!sharingOn){
            return(
                <div className="alert alert-primary">
                    <mark className="float-right">{this.state.fileName}</mark><br /> 
                    Your file is ready to download and Share. <br/>
                    <button className="btn btn-sm btn-link " onClick={this.downloadFile}>Download</button>
                    <button className="btn btn-sm btn-link " onClick={() => this.setState({share:true})}>Share</button>
                </div>
            );
        }
    }
    render(){
        let err = this.state.error;
        let sharingOn = this.state.share;
        if(err){
            return(<div className="alert alert-danger" role="alert">{err.toString()} <button className="btn btn-sm btn-danger float-right" onClick={()=>this.setState({error: null})}>Ok</button></div>);
        } else {
            return(
                <div>
                    {this.DownloadNShareButtons(sharingOn)}
                    {this.sharingButton(sharingOn)}
                </div>
            );
        }
    }
}

class CreateProjectFile extends React.Component{
    constructor(props){
        super(props);
        this.state = {fileContent: null, error: null, fileName: null, processingReady: false}
        this.uploadFile = this.uploadFile.bind(this);
        this.fileChange = this.fileChange.bind(this);
    }
    showError() {
        const error = this.state.error;
        if(error){
            return(<div className="alert alert-danger mb-2" role="alert">{error.toString()}</div>);
        }
    }

    fileChange(){
        this.setState({fileContent: null});
        const file = document.getElementById('fileUploder').value;
        console.log(file)
        if (file){
            this.setState({processingReady: true});
        } else {
            this.setState({processingReady: false});
        }
        console.log(this.state.processingReady)
    }
    fileProcessingButton(){

        const status = this.state.processingReady;
        if(status){
           return(
               <button className="btn btn-sm btn-outline-info" placeholder="Select " onClick={this.uploadFile}>Process File</button>
               );
        }
    }
    DownloadNShareComponent(){
        const fileContent = this.state.fileContent;
        if(fileContent){
            return(<DownloadNShare fileName={this.state.fileName} fileData={this.state.fileContent}/>);
        }
    }
  
    render(){
        const fileContent = this.state.fileContent;
        let error = this.state.error
        const processingReady = this.state.processingReady;
        return(
            <div className="container">
                <form id="myForm" name="myForm">
                    <input className="form-control-file" 
                        type="file" 
                        id="fileUploder" 
                        value={this.state.selectedFile}
                        name="uploadedFile"
                        accept="application/vnd.ms-excel"
                        multiple={false} 
                        onChange={this.fileChange} /> &nbsp;
                </form>
                {this.fileProcessingButton()}
                {this.DownloadNShareComponent()}                
                {this.showError()}
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
        const fileContent = this.state.fileContent;
        event.preventDefault();
        const file = document.getElementById('myForm');
        const fileName = this.getFileName();
        this.setState({fileName: fileName});
        let formData = new FormData(file);
        console.log(formData);
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