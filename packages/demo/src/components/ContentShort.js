import React from 'react'

const ContentShort = React.forwardRef((props, ref) => {
  const { className } = props
  return (
    <div className={className} ref={ref}>
      <b>Some shorter content</b>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pulvinar pharetra magna ac
        rhoncus. Pellentesque lacinia orci id turpis venenatis commodo. Suspendisse elementum
        tincidunt mattis. Fusce consequat felis felis, eget aliquam tellus scelerisque ac.
        Pellentesque sollicitudin tellus eu malesuada fringilla.
      </p>
    </div>
  )
})

export default ContentShort
