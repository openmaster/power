class DownloadNShare extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fileName: this.props.fileName, 
            fileData: this.props.fileData,
            uploadTypeProject: this.props.uploadTypeProject,
            error: null, 
            share: false, 
            uploading: false, 
            sharingResults: null
        }        
        
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
        const payload = {emails: emails, fileName: this.state.fileName, fileContent: this.state.fileData, uploadTypeProject: this.state.uploadTypeProject}
        const request = {
            url: '/api/shareFile',
            method: 'POST',
            data: payload
        }
        axios(request).then(result => {
            const previousSharingResults = this.state.sharingResults || [];
            this.setState({uploading: false, sharingResults: previousSharingResults.concat(result.data)})
        }).catch(err => {
            console.log(err.Error);
            const previousSharingResults = this.state.sharingResults || [];
            this.setState({uploading: false, sharingResults: previousSharingResults.concat({email:"Error: ", error: "Some error occured."})})
        });
    }

    sharingResult(){
        let results = this.state.sharingResults;
        if(results){
        const items = results.map((item) => <li className="list-group-item" key={item.email.toString()}> &#10025; {item.email} {(item.error)?<span className="text-danger">&#10006; {item.error}</span>:<span>&#10004;</span>}</li>);
            return(
                <ul className="list-group">
                    {items}
                </ul>
            );
        } else {
            return null;
        }
    }
    sharingComponent(sharingOn){
        let uploading = this.state.uploading;
        if(sharingOn){
            return(
                <div className="alert alert-primary container-fluid">
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

    DownloadNShareButtons(sharingOn) {
        const fileName = this.state.fileName;
        if(!sharingOn){
            return(
                <div>
                    <div className="alert alert-primary">
                        <p><mark>{fileName}</mark> is ready to download and Share.</p>
                    </div>
                    <button className="btn btn-sm btn-link float-right" onClick={() => this.setState({share:true})}>Share File</button>
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
                <div className="container">
                    {this.DownloadNShareButtons(sharingOn)}
                    {this.sharingComponent(sharingOn)}
                </div>
            );
        }
    }
}