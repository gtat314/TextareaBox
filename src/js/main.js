/**
 * 
 * @employSchema
 * @eventListeners
 * @sensibleDefaults
 * @svgSrc
 * @documentation
 * @documentationApi
 * @iconUniformNames
 * @minimizeProperties
 * @objectifyEventListeners
 * @parentElementSelector
 * @distinctEventListeners
 * @propertiesElemUnderscore
 * @propertify
 * @methodNamingConventions
 * @propertyNamingConventions
 * @htmlReadyMethods
 */




/**
 * 
 * @param {Object}                   schema
 * @param {HTMLElement|CSSRule}      schema.parent
 * @param {String}                  [schema.name]
 * @param {Boolean}                 [schema.htmlReady]
 * @param {Boolean}                 [schema.readOnly]
 * @param {Boolean}                 [schema.counter]
 * @param {Number}                  [schema.maxWords]
 * @param {Number}                  [schema.minWords]
 * @param {String}                  [schema.title]
 * @param {String}                  [schema.placeholder]
 * @param {SVGElement}              [schema.iconDefault]
 * @param {SVGElement}              [schema.iconLoading]
 * @param {SVGElement}              [schema.iconSuccess]
 * @param {SVGElement}              [schema.iconWarning]
 * @param {Boolean}                 [schema.spellcheck=false]
 * @param {Boolean}                 [schema.autofocus]
 * @param {Number}                  [schema.tabindex]
 * @param {HtmlID}                  [schema.form]
 * @param {Function}                [schema.onInput]
 * @param {Function}                [schema.onInputDelayed]
 * @param {Number}                  [schema.inputDelay=2000]
 * @param {Object[]}                [schema.eventListeners]
 * @param {'input'|'inputDelayed'}   schema.eventListeners[].type
 * @param {Function}                 schema.eventListeners[].listener
 * @param {Number}                  [schema.eventListeners[].delay=2000]
 */
function TextareaBox( schema ) {

    /**
     * 
     * @property
     * @private
     */
    this._schema = schema;

    /**
     * 
     * @property
     * @private
     */
    this._parentElem = null;

    /**
     * 
     * @property
     * @private
     */
    this._iconElem = null;

    /**
     * 
     * @property
     * @private
     */
    this._onInputCallback = null;

    /**
     * 
     * @property
     * @private
     */
    this._onInputDelayedCallback = null;

    /**
     * 
     * @property
     * @private
     */
    this._inputDelay = null;

    /**
     * 
     * @property
     * @private
     */
    this._inputDelayTimer = null;

    /**
     * 
     * @property
     * @private
     */
    this._textareaElem = null;

    /**
     * 
     * @property
     * @private
     */
    this._titleSpanElem = null;

    /**
     * 
     * @property
     * @private
     */
    this._counterBoxElem = null;

    /**
     * 
     * @property
     * @private
     */
    this._counterTextElem = null;

    /**
     * 
     * @property
     * @private
     */
    this._maxWordsElem = null;

    /**
     * 
     * @property
     * @private
     */
    this._inputId = null;

    /**
     * @property
     * @private
     */
    this._inputName = null;




    if ( typeof this._schema.parent === 'object' ) {

        this._parentElem = this._schema.parent;

    } else if ( typeof this._schema.parent === 'string' ) {

        this._parentElem = document.querySelector( this._schema.parent );
        this._inputId = 'textareabox_' + schema.parent.replace( '.', '' );

    }
    
    if ( this._schema.hasOwnProperty( 'name' ) ) {

        this._inputName = this._schema.name;

    }

    if ( schema.hasOwnProperty( 'htmlReady' ) && schema.htmlReady === true ) {

        this._createFromHTML();

    } else {

        this._createFromSchema();

    }

    if ( this._iconElem !== null ) {

        this._iconElem.addEventListener( 'click', this._evt_click_iconElem.bind( this ) );

    }

    if ( this._schema.hasOwnProperty( 'eventListeners' ) ) {

        for ( var i = 0 ; i < this._schema.eventListeners.length ; i++ ) {

            if ( this._schema.eventListeners[ i ].type === 'input' ) {

                this._onInputCallback = this._schema.eventListeners[ i ].listener;

            }

            if ( this._schema.eventListeners[ i ].type === 'inputDelayed' ) {

                this._onInputDelayedCallback = this._schema.eventListeners[ i ].listener;

                if ( this._schema.eventListeners[ i ].hasOwnProperty( 'delay' ) ) {

                    this._inputDelay = this._schema.eventListeners[ i ].delay;

                } else {

                    this._inputDelay = 2000;

                }

            }

        }

    }

    if ( this._schema.hasOwnProperty( 'onInput' ) ) {

        this._onInputCallback = this._schema.onInput;

    }

    if ( this._schema.hasOwnProperty( 'onInputDelayed' ) ) {

        this._onInputDelayedCallback = this._schema.onInputDelayed;

        if ( this._schema.hasOwnProperty( 'inputDelay' ) ) {

            this._inputDelay = this._schema.inputDelay;

        } else {

            this._inputDelay = 2000;

        }

    }

    this._textareaElem.addEventListener( 'input', this._evt_input_textareaElem.bind( this ) );
    
};

/**
 * 
 * @returns {String}
 */
TextareaBox.prototype.getValue = function() {

    return this._textareaElem.value;

};

/**
 * 
 * @param {String} value 
 */
TextareaBox.prototype.setValue = function( value ) {

    var valueNice = '';

    if ( typeof value !== 'undefined' ) {

        valueNice = value;

    }

    this._textareaElem.value = valueNice;

    if ( this._schema.hasOwnProperty( 'counter' ) && this._schema.counter === true ) {

        this._updateCounter();

    }

    if ( this._textareaElem.value !== '' ) {

        if ( this._iconElem !== null ) {

            this._iconElem.classList.add( 'active' );

        }

        this.clearError();

    } else {

        if ( this._iconElem !== null ) {

            this._iconElem.classList.remove( 'active' );

        }

    }

};

/**
 * 
 */
TextareaBox.prototype.loading = function() {

    this._iconElem.innerHTML = this._schema.iconLoading;

};

/**
 * 
 */
TextareaBox.prototype.removeLoading = function() {

    this._iconElem.innerHTML = this._schema.iconDefault;

};

/**
 * 
 */
TextareaBox.prototype.success = function() {

    this._parentElem.classList.add( 'success' );

    this._iconElem.innerHTML = this._schema.iconSuccess;

    setTimeout( function(){

        this._parentElem.classList.remove( 'success' );

        this._iconElem.innerHTML = this._schema.iconDefault;

    }.bind( this ), 3000 );

};

/**
 * 
 * @public
 * @method
 */
TextareaBox.prototype.setError = function() {

    this._parentElem.classList.add( 'error' );

    if ( this._schema.hasOwnProperty( 'iconWarning' ) ) {

        this._parentElem.classList.add( 'errorTemp' );
        this._iconElem.innerHTML = this._schema.iconWarning;

        setTimeout( function(){

            this._parentElem.classList.remove( 'errorTemp' );
            this._iconElem.innerHTML = this._schema.iconDefault;

        }.bind( this ), 3000 );

    }

};

/**
 * 
 * @method
 */
TextareaBox.prototype.clearError = function() {

    this._parentElem.classList.remove( 'error' );

    if ( this._schema.hasOwnProperty( 'iconWarning' ) ) {

        this._iconElem.innerHTML = this._schema.iconDefault;

    }

};

/**
 * 
 * @param {String} title 
 */
TextareaBox.prototype.setTitle = function( title ) {

    this._titleSpanElem.innerHTML = title;

    this._schema.title = title;

};

/**
 * 
 * @returns {String|null}
 */
TextareaBox.prototype.getName = function() {

    return this._inputName;

}




/**
 * 
 * @private
 * @param {Event} evt 
 */
TextareaBox.prototype._evt_click_iconElem = function( evt ) {

    if ( this._iconElem.classList.contains( 'active' ) === true ) {

        this._iconElem.classList.remove( 'active' );
        this._textareaElem.value = '';
        this.clearError();

    }

    this._textareaElem.focus();

    if ( this._onInputCallback !== null ) {

        this._onInputCallback( evt );

    }

    if ( this._onInputDelayedCallback !== null ) {

        this._onInputDelayedCallback( evt );

    }

};

/**
 * 
 */
TextareaBox.prototype._updateCounter = function() {

    var counterNum;

    if ( this._textareaElem.value === '' ) {

        counterNum = 0;

    } else {

        counterNum = this._textareaElem.value.trim().split(/\s+/).length;

    }

    this._counterTextElem.textContent = counterNum;

    if ( this._schema.hasOwnProperty( 'minWords' ) ) {

        if ( counterNum < this._schema.minWords ) {

            this._counterBoxElem.classList.remove( 'acceptable' );

        } else {

            this._counterBoxElem.classList.add( 'acceptable' );

        }

    }

    if ( this._schema.hasOwnProperty( 'maxWords' ) ) {

        if ( counterNum > this._schema.maxWords ) {

            this._counterBoxElem.classList.add( 'warning' );
            this._counterBoxElem.classList.remove( 'acceptable' );

        } else {

            this._counterBoxElem.classList.remove( 'warning' );

        }

    }

};

/**
 * 
 * @private
 * @param {Event} evt 
 */
TextareaBox.prototype._evt_input_textareaElem = function( evt ) {

    if ( this._schema.hasOwnProperty( 'counter' ) && this._schema.counter === true ) {

        this._updateCounter();

    }

    if ( this._textareaElem.value !== '' ) {

        this.clearError();

        if ( this._iconElem !== null ) {

            this._iconElem.classList.add( 'active' );

        }

    } else {

        if ( this._iconElem !== null ) {

            this._iconElem.classList.remove( 'active' );

        }

    }

    if ( this._onInputCallback !== null ) {

        this._onInputCallback( evt );

    }

    if ( this._onInputDelayedCallback !== null ) {

        clearTimeout( this._inputDelayTimer );

        this._inputDelayTimer = setTimeout( function(){

            this._onInputDelayedCallback( evt );

        }.bind( this ), this._inputDelay );

    }

};

/**
 * 
 * @private
 */
TextareaBox.prototype._createFromHTML = function() {

    if ( this._parentElem.querySelector( '.titleElem' ) ) {

        this._titleSpanElem = this._parentElem.querySelector( '.titleElem' );

    }

    if ( this._parentElem.querySelector( '.icon' ) ) {

        this._iconElem = this._parentElem.querySelector( '.icon' );
        this._iconElem.addEventListener( 'click', this._evt_click_iconElem.bind( this ) );

    }

    if ( this._parentElem.querySelector( '.counterBox' ) ) {

        this._counterBoxElem = this._parentElem.querySelector( '.counterBox' );
        this._counterTextElem = this._counterBoxElem.querySelector( 'span:nth-child(1)' );

        if ( this._counterBoxElem.querySelector( 'span:nth-child(3)' ) ) {

            this._maxWordsElem = this._counterBoxElem.querySelector( 'span:nth-child(3)' );

        }

    }

    this._textareaElem = this._parentElem.querySelector( 'textarea' );

    if ( this._textareaElem.hasAttribute( 'name' ) ) {

        this._inputName = this._textareaElem.getAttribute( 'name' );

    }
    
};

/**
 * 
 * @private
 */
TextareaBox.prototype._createFromSchema = function() {

    var fragment    = document.createDocumentFragment();
    var titleElem   = null;

    if ( this._schema.hasOwnProperty( 'title' ) ) {

        titleElem = document.createElement( 'DIV' );
        titleElem.classList.add( 'title' );
        fragment.appendChild( titleElem );

        this._titleSpanElem = document.createElement( 'LABEL' );
        this._titleSpanElem.classList.add( 'titleElem' );
        this._titleSpanElem.innerHTML = this._schema.title;
        titleElem.appendChild( this._titleSpanElem );

    }

    if ( this._schema.hasOwnProperty( 'iconDefault' ) ) {

        this._iconElem = document.createElement( 'SAMP' );
        this._iconElem.classList.add( 'icon' );
        this._iconElem.innerHTML = this._schema.iconDefault;
        titleElem.appendChild( this._iconElem );

    }

    if ( this._schema.hasOwnProperty( 'counter' ) && this._schema.counter === true ) {

        this._counterBoxElem = document.createElement( 'P' );
        this._counterBoxElem.classList.add( 'counterBox' );
        titleElem.appendChild( this._counterBoxElem );

        this._counterTextElem = document.createElement( 'SPAN' );
        this._counterTextElem.textContent = '0';
        this._counterBoxElem.appendChild( this._counterTextElem );

        if ( this._schema.hasOwnProperty( 'maxWords' ) ) {

            var counterDelimeterElem = document.createElement( 'SPAN' );
            counterDelimeterElem.textContent = ' / ';
            this._counterBoxElem.appendChild( counterDelimeterElem );

            this._maxWordsElem = document.createElement( 'SPAN' );
            this._maxWordsElem.textContent = this._schema.maxWords;
            this._counterBoxElem.appendChild( this._maxWordsElem );

        }

    }

    var bodyElem = document.createElement( 'DIV' );
    bodyElem.classList.add( 'body' );
    fragment.appendChild( bodyElem );

    this._textareaElem = document.createElement( 'TEXTAREA' );
    this._textareaElem.classList.add( 'textarea' );
    bodyElem.appendChild( this._textareaElem );

    if ( this._schema.hasOwnProperty( 'title' ) ) {

        if ( this._inputId !== null ) {

            this._titleSpanElem.setAttribute( 'for', this._inputId );
            this._textareaElem.id = this._inputId;
    
        }

    }

    if ( this._inputName !== null ) {

        this._textareaElem.setAttribute( 'name', this._inputName );

    }

    if ( this._schema.hasOwnProperty( 'spellcheck' ) === true ) {

        this._textareaElem.spellcheck = this._schema.spellcheck;

    } else {

        this._textareaElem.spellcheck = false;

    }

    if ( this._schema.hasOwnProperty( 'placeholder' ) === true ) {

        this._textareaElem.setAttribute( 'placeholder', this._schema.placeholder );

    }

    if ( this._schema.hasOwnProperty( 'tabindex' ) === true ) {

        this._textareaElem.setAttribute( 'tabindex', this._schema.tabindex );

    }

    if ( this._schema.hasOwnProperty( 'autofocus' ) === true ) {

        if ( this._schema.autofocus === true ) {

            this._textareaElem.setAttribute( 'autofocus', true );
            this._textareaElem.focus();

        }

    }

    if ( this._schema.hasOwnProperty( 'readOnly' ) === true && this._schema.readOnly === true ) {

        this._textareaElem.readOnly = true;
        this._parentElem.classList.add( 'mod_readOnly' );

    }

    if ( this._schema.hasOwnProperty( 'form' ) === true ) {

        this._textareaElem.setAttribute( 'form', this._schema.form );

    }

    this._parentElem.appendChild( fragment );

};