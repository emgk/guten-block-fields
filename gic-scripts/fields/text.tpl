<div className="editor-post-excerpt">
        <TextPlain
            label={ __( <%field-title%> ) }
            className="editor-post-<%field-slug%>"
            onChange={ ( value ) => onUpdateExcerpt( value ) }
            value={ excerpt }
        />
</div>