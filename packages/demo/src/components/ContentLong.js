import React from 'react'

const ContentLong = React.forwardRef((props, ref) => {
  const { className } = props
  return (
    <div className={className} ref={ref}>
      <b>Some longer content</b>
      <p>
        Suspendisse non ante dui. Phasellus tempor sem non cursus feugiat. Pellentesque quis justo
        neque. Proin est tellus, tincidunt in vestibulum vel, aliquam in lorem. Cras hendrerit
        mollis rutrum. Quisque at blandit erat. Nulla pharetra quam diam, id suscipit tortor
        volutpat faucibus. Donec consequat tellus id felis efficitur, at dapibus mi vehicula.
        Phasellus quis dolor mauris. Integer dictum quam eros, quis ultricies quam auctor a. Nam
        commodo facilisis hendrerit. Vivamus dapibus tortor nec bibendum molestie. Curabitur
        tristique at turpis nec facilisis. Maecenas non quam dolor. Aliquam faucibus, odio et rutrum
        scelerisque, turpis turpis fringilla nibh, non scelerisque libero ipsum a ipsum.
      </p>
    </div>
  )
})

export default ContentLong
