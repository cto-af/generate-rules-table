export interface CreateOptions {
    cwd?: string;
    readme?: string;
}
/**
 * Create a rules table in the README.md found for this project.
 *
 * @param opts Options.
 */
export declare function createRulesTable(opts?: CreateOptions): Promise<void>;
