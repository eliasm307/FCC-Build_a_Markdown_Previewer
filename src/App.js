import React from "react";
import marked from "marked";
import DOMPurify from "dompurify";
import "./styles.scss";
import SplitPane from "react-split-pane"; 
import Pane from "react-split-pane"; 

// using ES6 modules
//import Split from 'react-split'

// using CommonJS modules
//var Split = require("react-split");

///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
//MARKED SETUP

// ALLOWS LINE BREAKS WITH RETURN BUTTON
marked.setOptions({
  breaks: true
});
/*
// INSERTS target="_blank" INTO HREF TAGS (required for codepen links)
const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<a target="_blank" href="${href}">${text}` + '</a>';
}

// Override function
renderer.br = function () { 
    return `<br/>`;
};*/

// Override function
const renderer = {
  link(href, title, text) {
    console.log(
      "rendering markdown for link, href: ",
      href,
      "title: ",
      title,
      "text: ",
      text
    );
    return (
      `
<a target="_blank" href="${href}">${text} + "</a>"`
    );
  } /*,
  br() { 
    console.log("rendering markdown for br");
    return `
<br/>`;
  }*/

  /*,
  text(text) {
    console.log("rendering markdown for text: ''", text, "''");
    return `
<p>${text}<p>`;
  }*/
};

marked.use({ renderer });

//////////////////////////////////////////////////////////////////////////////
//VARIABLES
let date = new Date();

//////////////////////////////////////////////////////////////////////////////
//CONSTANTS
const sSEPARATOR = "--------------------------------";

const placeholder = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`;
//////////////////////////////////////////////////////////////////////////////
//FUNCTIONS

let RenderMarkdown = (sMarkdown) => {
  console.log("RenderMarkdown RAW: ", sMarkdown);

  //sMarkdown = sMarkdown.replace(/\n/g, `<br>\n`);
  //sMarkdown = sMarkdown.replace(/\r\n|\r|\n/g, '<br>');

  //sMarkdown = sMarkdown.replace(/\r\n\r\n|\r\r|\n\n/g, '<br>');

  //console.log("RenderMarkdown line breaks replaced: ", sMarkdown);

  let renderedHTML = marked(sMarkdown);

  //console.log("renderedHTML: ", renderedHTML);

  let sanitizedHTML = DOMPurify.sanitize(renderedHTML);

  //console.log("sanitizedHTML: ", sanitizedHTML);

  //marked(sMarkdown, { renderer: renderer });
  return sanitizedHTML;

  /*
  test
  string htmlFragment = "<IMG SRC=`javascript:alert(\"RSnake says, 'XSS'\")`>";
            string actual = sanitizer.Sanitize(htmlFragment);

            // Assert
            string expected = "<img>";
  */
};

//////////////////////////////////////////////////////////////////////////////
//REACT

class Wrapper extends React.Component {
  constructor(props) {
    console.log("Wrapper constructor");
    super(props);
    this.state = {
      markdown: placeholder,
      renderedHTML: RenderMarkdown(placeholder)
    };

    console.log("Wrapper Text change method binding");
    this.handleTextChange = this.handleTextChange.bind(this);

    //initial render with placeholder
    /*this.handleTextChange({
      target: {
        value: placeholder
      }
    });*/
  }

  handleSizeButtonClick(event) {
    console.log(date.toLocaleString(), "TBC");
  }

  handleTextChange(event) {
    console.log("handleTextChange method: ", event.target.value);
    let sMarkdown = event.target.value;
    let srenderedHTML = RenderMarkdown(sMarkdown);

    console.log(sSEPARATOR);
    console.log(date.toLocaleString(), "Markdown input (sanitised)");
    //console.log( sMarkdown);

    console.log(sSEPARATOR);
    console.log(date.toLocaleString(), "Markdown rendered output");
    //console.log( srenderedHTML);

    console.log(sSEPARATOR);

    this.setState({
      markdown: sMarkdown,
      renderedHTML: srenderedHTML
    });
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log("error:", error.toString(), "errorInfo: ", errorInfo);
  }

  render() {
    console.log(date.toLocaleString(), "Wrapper Pre-Render");
    
      return (
        <div id="wrapper" className="">
          <div id="title-row" className="row">
            <h1 id="title">Markdown Previewer</h1>
          </div>

          <div 
            id="text-area-row" 
            className="row-md container-fluid d-flex flex-column grow"
          >
            
              <SplitPane  
                split="vertical" 
                minSize={50} 
              >
                <Pane  
                  minSize="10%"
                >
                  <EditorContainer
                    markdown={this.state.markdown}
                    handleTextChange={this.handleTextChange}
                  />
                </Pane >

                <Pane  
                  minSize="10%"
                >
                  <HTMLPreviewContainer 
                    renderedHTML={this.state.renderedHTML} 
                  />
                </Pane >

                <Pane  
                  minSize="10%"
                >
                  <PreviewContainer 
                    renderedHTML={this.state.renderedHTML} 
                  />
                </Pane >
  
              </SplitPane> 
          </div>
        </div>
      );
/*
      return (
        <div id="text-area-row" className="container-fluid">
            <div className="row">
              <div className="col">

        <Split 
        sizes={[25, 75]}
        minSize={100}
        expandToMin={true}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="vertical"
        cursor="col-resize" 
        >
          <EditorContainer
                    markdown={this.state.markdown}
                    handleTextChange={this.handleTextChange}
                  />

<PreviewContainer 
                    renderedHTML={this.state.renderedHTML} 
                  />
        </Split>

        </div>
        </div>
        </div>
      );*/
    
  }
}
//import Split from 'react-split';
/*const SplitComponent1 = (props) => {
  console.log(date.toLocaleString(), "SplitComponent Pre-Render");
  console.log(date.toLocaleString(), "Split: ", Split);
 
  return (
    <Split>
      <div></div>
      <div></div>
    </Split>
  ); 
};*/

/*const SplitComponent2 = (props) => {
  console.log(date.toLocaleString(), "SplitComponent2 Pre-Render");
  //console.log(date.toLocaleString(), "Split2: ", SplitPane);

  return (
    <SplitPane 
      split="vertical" 
      minSize={500}
    >
      <div>or you can use a plain old div</div>
      <div>or you can use a plain old div</div>
    </SplitPane>
  );
};
*/
/*<SplitPane split="vertical" minSize={50} defaultSize={100}>
      <div>22</div>
      <div>22</div>
    </SplitPane>
    */

//export default SplitComponent;

const EditorContainer = (props) => {
  console.log(date.toLocaleString(), "EditorContainer Pre-Render");
  return ( 
    <div className="textarea-container">
      <textarea
        id="editor"
        onChange={props.handleTextChange}
        value={props.markdown}
      ></textarea>
    </div> 
  );
};

const HTMLPreviewContainer = (props) => {
  console.log(date.toLocaleString(), "HTMLPreviewContainer Pre-Render");

  let text = props.renderedHTML;

  if(typeof(text)==="string") 
  {
    //text = text.replace("<", "&lt;");
    //text = text.replace(">", "&gt;");
    console.log("rendered HTML text as text: ", text.split(/\r?\n/));
  }
  else
  {
    console.log("Type of rendered HTML text prop is not text, it is ", typeof(text));
  }

  //<textarea id="HTMLpreview" value={props.renderedHTML} readOnly></textarea>

  //let s = text.split(/\r?\n/).map(e =>  {e} + </br>);
  return (
    <div className="textarea-container"> 
      <p id="HTMLpreview">
        {text.split(/\r?\n/).map(e =>  <p>{e}</p>)}
      </p>
    </div>
  );
};

const PreviewContainer = (props) => {
  console.log(date.toLocaleString(), "PreviewContainer Pre-Render");
  return (
    <div id="preview" className="textarea-container">
      <div dangerouslySetInnerHTML={{ __html: props.renderedHTML }} />
    </div>
  );
};

console.log(date.toLocaleString(), "ReactDOM Pre-Render");
//ReactDOM.render(<Wrapper />, document.getElementById("wrapper"));

//ReactDOM.render(<SplitComponent1 />, document.getElementById("wrapper"));
export default function App() {
  return <Wrapper />;
}
