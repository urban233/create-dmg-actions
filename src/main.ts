import * as core from '@actions/core'
import { exec } from '@actions/exec'
import * as fs from 'fs'
import * as path from 'path'

function writeSVGToFile(svg: string, filePath: string): void {
  fs.writeFile(filePath, svg, 'utf-8', err => {
    if (err) {
      core.setFailed(err.message)
      return
    }

    core.debug('SVG data has been written to the file successfully.')
  })
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const src_dir: string = core.getInput('src_dir')
    const dmg_name: string = core.getInput('dmg_name')
    const bg_filepath: string = core.getInput('bg_filepath')
    // Expect to get xxx.app
    const base_name: string = path.basename(src_dir)
    core.debug(`src_dir = ${src_dir} `)
    core.debug(`dmg_name = ${dmg_name} `)
    core.debug(`base_name = ${base_name}`)
    core.debug(`base_name = ${bg_filepath}`)

    core.info(`Installing create-dmg`)
    await exec(`brew install create-dmg`)
    core.info(`create-dmg installed`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await exec(
      `create-dmg --volname "${dmg_name}" --background "${bg_filepath}" --window-pos 200 120 --window-size 660 400 --icon-size 100 --icon ${base_name} 160 185 --app-drop-link 500 185 ${dmg_name}.dmg ${src_dir}`
    )
    core.info(`Create dmg finished`)

    // Set outputs for other workflow steps to use
    core.setOutput('dmg_name', `${dmg_name}.dmg`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
