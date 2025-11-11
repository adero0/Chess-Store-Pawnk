package com.akacin.sklep_szachowy.service;

import com.akacin.sklep_szachowy.dto.SliderConfigDto;
import com.akacin.sklep_szachowy.model.SliderConfig;
import com.akacin.sklep_szachowy.repository.SliderConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SliderConfigService {

    @Autowired
    private SliderConfigRepository sliderConfigRepository;

    @Transactional(readOnly = true)
    public SliderConfigDto getSliderConfig() {
        List<SliderConfig> configs = sliderConfigRepository.findAll();
        SliderConfig config;
        if (configs.isEmpty()) {
            config = sliderConfigRepository.save(new SliderConfig());
        } else {
            config = configs.get(0);
        }
        return SliderConfigDto.fromEntity(config);
    }

    @Transactional
    public SliderConfigDto updateSliderConfig(SliderConfig sliderConfig) {
        SliderConfig updatedConfig = sliderConfigRepository.save(sliderConfig);
        return SliderConfigDto.fromEntity(updatedConfig);
    }
}
