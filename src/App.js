import React from "react";
import marked from "marked";
import DOMPurify from "dompurify";
import "./styles.scss";
import "./split-pane.css";
import SplitPane from "react-split-pane";
import Pane from "react-split-pane";
//import Resizer from "react-split-pane";

/*
Project based on FCC Front End Libraries Projects - Build a Markdown Previewer challenge: https://www.freecodecamp.org/learn/front-end-libraries/front-end-libraries-projects/build-a-markdown-previewer
*/


/*
TODO
-Add html formatting for rendered HTML pane 
-Add option for light or dark theme

- Add toolbars to each of the panes with options for
-   full screen
-   Show title

- Add more colour
- Center title vertically 
- Customise resizer bars, maybe use this to show title
*/
 
//////////////////////////////////////////////////////////////////////////////
//VARIABLES and CONSTANTS
const date = new Date(); 

const sPANE_TITLE_HTML = "HTML";
const sPANE_TITLE_MARKUP = "Markup";
const sPANE_TITLE_RENDERED_HTML = "Result";

const sSEPARATOR = "--------------------------------";

const sPLACEHOLDER = `# Welcome to my React Markdown Previewer!

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

![React Logo w/ Text](https://techchronos.com/wp-content/uploads/SszarkLabs/stack-icon/cywBkaGwkMeDAuJbSt1k.png)
`;

const sPLACEHOLDER2 = `1. List item one.
+
List item one continued with a second paragraph followed by an
Indented block.
+
.................
$ ls *.sh
$ mv *.sh ~/tmp
.................
+
List item continued with a third paragraph.

2. List item two continued with an open block.
+
--
This paragraph is part of the preceding list item.

a. This list is nested and does not require explicit item
continuation.
+
This paragraph is part of the preceding list item.

b. List item b.

This paragraph belongs to item two of the outer list.
--`;


///////////////////////////////////////////////////////////////////////////////
//MARKED SETUP
 
// Override renderer functions
const oRENDERER = {
  link(href, title, text) {
    console.log(
      "rendering markdown for link, href: ",
      href,
      "title: ",
      title,
      "text: ",
      text
    );
    return `
<a target="_blank" tooltip="${href}" href="${href}">${text}</a>`;
  },
  image(href, title, text) {
    return `<img class="img-fluid" alt="${text}" src="${href}"/>`
  },
  table(header, body) {
    console.log("Table header: ", header, "Table Body: ", body);

    return `
      <div class="table-wrapper">
        <table>
            <thead> 
              ${header}
            </thead>
  
            <tbody>
              ${body} 
            </tbody>

        </table>
      </div>`;
  }
   
};

marked.use({ renderer: oRENDERER });

// ALLOWS LINE BREAKS WITH RETURN BUTTON
marked.setOptions({
  gfm: true,
  breaks: true
    
});

//////////////////////////////////////////////////////////////////////////////
//FUNCTIONS

let RenderMarkdown = (sMarkdown) => { 

  let renderedHTML = marked(sMarkdown); 

  let sanitizedHTML = DOMPurify.sanitize(renderedHTML); 
 
  return sanitizedHTML; 
};

//////////////////////////////////////////////////////////////////////////////
//REACT

class Wrapper extends React.Component {
  constructor(props) {
    console.log("Wrapper constructor");
    super(props);
    this.state = {
      markdown: sPLACEHOLDER,
      renderedHTML: RenderMarkdown(sPLACEHOLDER)
    };

    console.log("Wrapper Text change method binding");
    this.handleTextChange = this.handleTextChange.bind(this);
 
  } 

  handleTextChange(event) {
    console.log("handleTextChange method: ", event.target.value);
    let sMarkdown = event.target.value;
    let sRenderedHTML = RenderMarkdown(sMarkdown); 

    this.setState({
      markdown: sMarkdown,
      renderedHTML: sRenderedHTML
    });
  }

  componentDidCatch(error, errorInfo) { 
    console.log("error:", error.toString(), "errorInfo: ", errorInfo);
  }

  render() {
    console.log(date.toLocaleString(), "Wrapper Pre-Render"); 

    return (
      <div id="wrapper" className="">
        <div id="title-row" className="row">
          <h1 id="title">Markdown Previewer</h1>
          <hr/>
        </div>

        <div
          id="text-area-row"
          className="row-md"
        >
          <SplitPane 
            split="vertical" 
            minSize={50} 
            //className="Resizerx"
            resizerClassName="Resizer"  //doesnt work on react-split-pane v2.+ for some reason
          >
            <Pane minSize="15%"> 
              <EditorContainer
                markdown={this.state.markdown}
                handleTextChange={this.handleTextChange}
                
              /> 
            </Pane>

            <Pane minSize="15%"> 
              <HTMLPreviewContainer 
                renderedHTML={this.state.renderedHTML} 
              /> 
            </Pane>

            <Pane minSize="20%"> 
              <PreviewContainer 
                renderedHTML={this.state.renderedHTML} 
              /> 
            </Pane>
            
          </SplitPane>
        </div>
      </div>
    );
  }
}

const PaneTitle = (props) => { 
  return (
    <div className="pane-title">
      <h2>{props.title}</h2>
    </div>
  ); 
}

const EditorContainer = (props) => {
  console.log(date.toLocaleString(), "EditorContainer Pre-Render");
  return (
    <div className="textarea-container">
      <PaneTitle title={sPANE_TITLE_MARKUP} />
      <textarea
        id="editor"
        onChange={props.handleTextChange}
        value={props.markdown}
      />
    </div>
  );
};
 
const HTMLPreviewContainer = (props) => {
  console.log(date.toLocaleString(), "HTMLPreviewContainer Pre-Render");

  let sText = props.renderedHTML;

  if (typeof sText === "string") {
    //text = text.replace("<", "&lt;");
    //text = text.replace(">", "&gt;");
    //console.log("rendered HTML text as text: ", text.split(/\r?\n/));
  } else {
    console.log(
      "Type of rendered HTML text prop is not text, it is ",
      typeof sText
    );
  }
 
  //convert renderedHTML to plain text inside HTML tags
  let s = sText.split(/\r?\n/).map((e, i) => (
            <p key={i}>{e}</p>
          ));

  return (
    <div className="textarea-container"> 
      <PaneTitle title={sPANE_TITLE_HTML} />
      <div id="html-preview">
        {s}
      </div>
    </div>
  );
};

const PreviewContainer = (props) => {
  console.log(date.toLocaleString(), "PreviewContainer Pre-Render");
  return (
    <div  className="textarea-container"> 
      <PaneTitle title={sPANE_TITLE_RENDERED_HTML} />
      <div id="preview" dangerouslySetInnerHTML={{ __html: props.renderedHTML }} />
    </div>
  );
};

console.log(date.toLocaleString(), "ReactDOM Pre-Render"); 

export default function App() {
  return <Wrapper />;
}
