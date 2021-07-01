import { EditorState, convertFromRaw } from 'draft-js'


export default function getInitialEditorState ( preset ) {
    return () => contentPresets [ preset ] ()
}


export const contentPresets = {
    empty: () => EditorState.createEmpty (),
    englishText: () => EditorState.createWithContent ( convertFromRaw (
        {"blocks":[{"key":"6krbv","text":"The Greatest Block Editor Known to Man","type":"header-one","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5h4ci","text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"csl0t","text":"Why is it so Great?","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"77to5","text":"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3cefe","text":"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5d6iv","text":"The Three Pillars of Greatness","type":"header-three","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"67lkb","text":"Being the Greatest in every Aspect Imaginable.","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"1cp3k","text":"Not Being not Great in any Aspect Possibly Possible.","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"1ojs8","text":"The Above Two.","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"aupk3","text":"Steps to Creating the Greatest Editor on Earth","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2agqd","text":"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"1aviv","text":"Call Nextle and ask them to create the createst editor on the planet.","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8rbal","text":"Wait untill Nextle creates the greatest editor that ever editted the texts on the Earth.","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7pbkd","text":"Reveal your miraculous editor to the inhabitants of Earth and let them explode of excitement and wonder.","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2o6h0","text":"The Greatness is not in the Greatness itself but in the Essence of a Great Thing that is Great Both Objectively and Subjectively - Friedrich Wilhelm Nietzsche (1844 - 1900)","type":"blockquote","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"d6ntv","text":"How to Use the Greatest Editor that Can Ever be Written in Your Project","type":"header-three","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"ar0ga","text":"import GreatesetEditor, { withExtraGreatness } from 'greatest-editor'\n\nfunction GreatApp () {\n    return <GreatestEditor />\n}\n\nexport default withExtraGreatness ( GreatApp )","type":"code-block","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}
    ) )
}
