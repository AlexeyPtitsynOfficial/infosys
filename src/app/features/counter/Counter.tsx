import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { increment, decrement, incrementByAmount } from './counterSlice';

const Counter = () => {
    const count = useAppSelector((state) => state.counter.count);
    const dispatch = useAppDispatch();

    const [incrementAmount, setIncrementAmount] = useState("0");

    const addValue = Number(incrementAmount) || 0;

    return (
        <section>
            <p>{count}</p>
            <div>
                <button onClick={() => dispatch(increment())}>+</button>
                <button onClick={() => dispatch(decrement())}>-</button>
            </div>

            <input type='text' value={incrementAmount} onChange={(e) => setIncrementAmount(e.target.value)}/>
            <div>
                <button onClick={() => dispatch(incrementByAmount(addValue))}>Add amount</button>
            </div>
        </section>
    )
}

export default Counter