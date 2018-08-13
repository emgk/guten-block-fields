<RadioControl
		label="#radio-label#"
		help="#radio-help#"
		selected={ #radio-option# }
		options={ #radio-options# }
		onChange={ ( option ) => { 
            setState( { option } ) 
            } 
        }
/>