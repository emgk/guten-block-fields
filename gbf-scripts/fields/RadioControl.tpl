<RadioControl
		label="#field-label#"
		help="#field-help#"
		selected=#field-option#
		options={ #field-options# }
		onChange={ ( option ) => { 
            setState( { option } ) 
            } 
        }
/>
