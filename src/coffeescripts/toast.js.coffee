DEFAULT_DURATION = 'medium'

DURATION_MAP =
  'short': 2000
  'medium': 4000
  'long': 6000

OPTIONS = ['duration', 'content', 'id', 'className', 'animate', 'allowHTML']

class window.Toast
  @VERSION: '1.0'

  constructor: (options = {}) ->
    @tc = new TransitionCallbacks(clearAll: true, timeout: 500)
    @
      ._setupDefaultOptions(options)
      ._createElement()
      ._addElementId()

  _setupDefaultOptions: (options) =>
    @[opt] = options[opt] for opt of OPTIONS
    @duration = options.duration or DEFAULT_DURATION
    @animate = @animate isnt false
    return this

  _createElement: =>
    @element = document.createElement('div')
    return this

  _addElementId: =>
    @element.id = @id if @id
    return this

  show: (options={}) =>
    return if @_hasClass('bounce')
    @_temporaryOptions = options
    @
      ._removeClass('hide')
      ._clearTimeout()
      ._addContent()
      ._addElementClasses()
      ._showElement()
      ._setupHideTimer()
    return this

  _hasClass: (className) =>
    Toast._classRegexp(className).test(@element.className)

  @_classRegexp: (className) =>
    @_classRegexpLookup ||= {}
    @_classRegexpLookup[className] ||= new RegExp("(^| )#{className}($| )")

  _removeClass: (classNames...) =>
    for className in classNames
      regexp = Toast._classRegexp(className)
      @element.className = @element.className.replace(regexp, '')
    return this

  _clearTimeout: =>
    clearTimeout(@hideTimeout)
    @hideTimeout = undefined
    return this

  _addContent: (content=@_option('content')) =>
    return @_addContent(content) if typeof content is 'function'

    key = if @_option('allowHTML') is true
      'innerHTML'
    else if @element.innerText?
      'innerText'
    else
      'textContent'

    @element[key] = content

    return this

  _option: (name) =>
    if name of @_temporaryOptions
      @_temporaryOptions[name]
    else
      @[name]

  _shouldAnimate: =>
    @_option('animate') isnt false

  _addElementClasses: =>
    if not @isShowing()
      @element.className = 'toast'
      @_addClass('animate') if @_shouldAnimate()
      @_addClass(@className) if @_option('className')

    return this

  isShowing: =>
    (@_hasClass('shown') or @_hasClass('show')) and not @_hasClass('hide')

  _showElement: =>
    document.body.appendChild(@element)

    width = @element.offsetWidth
    height = @element.offsetHeight

    @element.style.marginLeft = parseInt(-width/2, 10) + 'px'
    @element.style.marginTop = parseInt(-height/2, 10) + 'px'
    @element.style.left = '50%'
    @element.style.top = '50%'

    @_addClass('bounce')
    @_addClass('show') if not @isShowing()

    return this

  _addClass: (classNames...) =>
    for className in classNames
      if not @_hasClass(className)
        @element.className += ' ' if @element.className
        @element.className += className
    return this

  _setupHideTimer: =>
    duration = @_option('duration')
    duration = DURATION_MAP[duration] if duration of DURATION_MAP

    @tc.addCallback @element, =>
      if duration isnt 'infinite'
        @hideTimeout = setTimeout(
          =>
            @hide()
          , duration
        )

      @
        ._removeClass('show', 'bounce')
        ._addClass('shown')

    return this

  hide: (options = {}) =>
    @_temporaryOptions = options
    @_clearTimeout()

    if @_shouldAnimate()
      @_addClass('hide')
      @tc.addCallback(@element, @_remove)
    else
      @_remove()

    return this

  _remove: =>
    @element.parentNode?.removeChild(@element)
    @._removeClass('hide', 'shown')
    return this
