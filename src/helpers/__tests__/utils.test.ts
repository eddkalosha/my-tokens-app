import {
    addressWithMidEll,
    checkPrivateKey,
    isNumber,
    numberFormatter,
    timeSince,
} from '../utils'

describe('utils testing', () => {
    it('Should check private key of wallet', () => {
        expect(checkPrivateKey('mykeywrongforat')).toBe(false)
        expect(
            checkPrivateKey(
                '26d203424f24a19ce1e195bev5c08a853c2b22e5d4ebcab1d431ac7a7f23edb3'
            )
        ).toBe(true)
        expect(checkPrivateKey('2d203424f24a19ce1e1bev5c08a')).toBe(false)
    })

    it('Should check is provided value correct number', () => {
        expect(isNumber('sometext')).toBe(false)
        expect(isNumber(1)).toBe(true)
        expect(isNumber(0)).toBe(true)
        expect(isNumber('0')).toBe(false)
    })

    it('Should add ellipses for long address in the middle of', () => {
        expect(
            addressWithMidEll('0xe4e174d0FC80dea9AC9A6C622BEBAA75C6B3EEa1')
        ).toBe('0xe4e174d0...75C6B3EEa1')
        expect(addressWithMidEll('0xe4e174d0FC80')).toBe('0xe4e174d0FC80')
    })

    it('Should do formatting numbers in US formates', () => {
        expect(numberFormatter(1000000)).toBe('1,000,000')
        expect(numberFormatter(0.123456)).toBe('0.123')
        expect(numberFormatter(undefined as unknown as string)).toBe(undefined)
    })

    it('Should get time period name since some time', () => {
        expect(timeSince(new Date().getTime() - 1000)).toBe('1 second(-s) ago')
        expect(timeSince(new Date().getTime() - 1000 * 61)).toBe(
            '1 minute(-s) ago'
        )
        expect(timeSince(new Date().getTime() - 1000 * 61 * 60)).toBe(
            '1 hour(-s) ago'
        )
        expect(timeSince(new Date().getTime() - 1000 * 61 * 60 * 24)).toBe(
            '1 day(-s) ago'
        )
        expect(timeSince(new Date().getTime() - 1000 * 61 * 60 * 24 * 31)).toBe(
            '1 month(-s) ago'
        )
        expect(
            timeSince(new Date().getTime() - 1000 * 61 * 60 * 24 * 31 * 12)
        ).toBe('1 year(-s) ago')
    })
})
