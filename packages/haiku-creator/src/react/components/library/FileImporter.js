import React from 'react'
import Color from 'color'
import Popover from 'react-popover'
import { Experiment, experimentIsEnabled } from 'haiku-common/lib/experiments'
import Palette from 'haiku-ui-common/lib/Palette'
import mixpanel from 'haiku-serialization/src/utils/Mixpanel'
import FigmaImporter from './importers/FigmaImporter'
import FileSystemImporter from './importers/FileSystemImporter'
import { DASH_STYLES } from '../../styles/dashShared'

const STYLES = {
  popover: {
    background: Palette.COAL,
    borderRadius: '4px',
    textAlign: 'left',
    position: 'relative',
    item: {
      ...DASH_STYLES.popover.item,
      width: '100%'
    },
    text: {
      ...DASH_STYLES.popover.text,
      ...DASH_STYLES.upcase,
      cursor: 'pointer',
      width: '100%'
    }
  },
  button: {
    position: 'relative',
    zIndex: 2,
    padding: '3px 9px',
    backgroundColor: Palette.DARKER_GRAY,
    color: Palette.ROCK,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: -4,
    borderRadius: 3,
    cursor: 'pointer',
    transform: 'scale(1)',
    transition: 'transform 200ms ease',
    ':hover': {
      backgroundColor: Color(Palette.DARKER_GRAY).darken(0.2)
    },
    ':active': {
      transform: 'scale(.8)'
    }
  }
}

class FileImporter extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      isPopoverOpen: false
    }
  }

  showPopover () {
    this.setState({ isPopoverOpen: true })
    mixpanel.haikuTrack('creator:file-importer:open-all')
  }

  hidePopover () {
    this.setState({ isPopoverOpen: false })
  }

  get popoverBody () {
    return (
      <div
        style={{
          ...DASH_STYLES.popover.container,
          right: 0,
          top: 0,
          position: 'initial'
        }}
      >
        <div style={STYLES.popover.item}>
          <FileSystemImporter style={STYLES.popover.text} />
        </div>
        <div style={STYLES.popover.item}>
          <FigmaImporter
            figma={this.props.figma}
            onImportFigmaAsset={this.props.onImportFigmaAsset}
            onAskForFigmaAuth={this.props.onAskForFigmaAuth}
            style={STYLES.popover.text}
            onPopoverHide={() => {
              this.hidePopover()
            }}
          />
        </div>
      </div>
    )
  }

  render () {
    if (experimentIsEnabled(Experiment.FigmaIntegration)) {
      return (
        <Popover
          onOuterAction={() => {
            this.hidePopover()
          }}
          isOpen={this.state.isPopoverOpen}
          place='below'
          tipSize={0.01}
          body={this.popoverBody}
        >
          <button
            style={STYLES.button}
            onClick={() => {
              this.showPopover()
            }}
          >
            +
          </button>
        </Popover>
      )
    } else {
      return (
        <button
          style={STYLES.button}
          onClick={() => {
            this.showPopover()
          }}
        >
          <FileSystemImporter style={STYLES.popover.text} text='+' />
        </button>
      )
    }
  }
}

FileImporter.propTypes = {
  onFileDrop: React.PropTypes.func.isRequired,
  onImportFigmaAsset: React.PropTypes.func.isRequired,
  onAskForFigmaAuth: React.PropTypes.func.isRequired,
  figma: React.PropTypes.object
}

export default FileImporter