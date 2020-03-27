class XmlViewer extends React.Component{
    constructor(props){
        super(props);
        this.state = {fileContent: this.props.fileContent, error: null};
    }

    componentDidUpdate(prevProps) {
        if (this.props.fileContent !== prevProps.fileContent) {
          this.setState({fileContent: this.props.fileContent})
        }
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
                    <h3 className="text-center">Your file Contents</h3>
                    <button className="btn btn-sm btn-link">Download</button>
                    <textarea className="container userFile" readOnly value={fileContent} />
                </div>
            );
        } else {
            return(
                <h4>Please Select a file.</h4>
            );
        }
    }
}