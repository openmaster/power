class XmlViewer extends React.Component{
    constructor(props){
        super(props);
        this.state = {fileContent: this.props.fileContent, error: null};
        this.downloadFile = this.downloadFile.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.fileContent !== prevProps.fileContent) {
          this.setState({fileContent: this.props.fileContent})
        }
    }
    downloadFile(){
        const fileName = 'sample.xml';
        const data = this.state.fileContent;
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

    render(){
        const error = this.state.error;
        const fileContent = this.state.fileContent;

        if(error){
            return(
                <div className="alert alert-danger mb-2" role="alert">{error.toString()}</div>
            );
        } else if(fileContent) {
            return(
                <div className="container">
                    <button className="btn btn-sm btn-link float-right" onClick={this.downloadFile}>Download</button>
                    <button className="btn btn-sm btn-link float-right" >Share File</button>                    
                    <h3 className="text-center">CT File Content</h3>
                    <textarea className="container userFile" readOnly value={fileContent} />
                </div>
            );
        } else {
            return(
                <h5>Please Select a file.</h5>
            );
        }
    }
}