export default class FilterDto {
    /**
     * @param {string} key
     * @param {string|number} value
     * @param {string} operator
     */
    constructor(
        key,
        value,
        operator
    ) {
        this._key = key;
        this._value = value;
        this._operator = operator;
    }

    /**
     * @returns {string}
     */
    getKey() {
        return this._key;
    }

    /**
     * @returns {string|number}
     */
    getValue() {
        return this._value;
    }

    /**
     * @return {string}
     */
    getOperator() {
        return this._operator;
    }
}
