/*
 * This file is released under the MIT license.
 * Copyright (c) 2016, 2020 Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { ANTLRErrorListener, Recognizer, RecognitionException, Token, CommonToken } from "antlr4ts";

import { Override } from "antlr4ts/Decorators";
import { DiagnosticEntry, DiagnosticType } from "../backend/facade";

export class ContextErrorListener implements ANTLRErrorListener<CommonToken> {
    public constructor(private errorList: DiagnosticEntry[]) {
    }

    @Override
    public syntaxError<T extends Token>(recognizer: Recognizer<T, any>, offendingSymbol: T | undefined, line: number,
        charPositionInLine: number, msg: string, e: RecognitionException | undefined): void {
        const error: DiagnosticEntry = {
            type: DiagnosticType.Error,
            message: msg,
            range: {
                start: {
                    column: charPositionInLine,
                    row: line,
                },
                end: {
                    column: charPositionInLine + 1,
                    row: line,
                },
            },
        };

        if (offendingSymbol) {
            error.range.end.column = charPositionInLine + offendingSymbol.stopIndex - offendingSymbol.startIndex + 1;
        }
        this.errorList.push(error);
    }
}
